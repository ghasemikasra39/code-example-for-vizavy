import BackendApiClient from './BackendApiClient';
import FormData from 'react-native/Libraries/Network/FormData';
import { store } from '../../store';
import { Bugtracker } from '../utility/BugTrackerService';
import { actionCreators } from '../../store/actions';
import MixPanelClient, { MESSAGE_SENT } from '../utility/MixPanelClient';
import PusherClient from '../Pusher/PusherClient';
import NavigationService from '../utility/NavigationService';

class DirectChatsManager {
  dispatcher = (action) => {
    store.dispatch(action);
  };

  captureError = (error) => {
    Bugtracker.captureException(error, { scope: 'ChatRoomManager' });
  };

  errorDispatcher = (action, error) => {
    this.dispatcher(action);
    this.captureError(error);
  };

  getDirectChatList = () => {
    const requestConfig = { url: 'direct-chats', method: 'GET' };

    const promise = BackendApiClient.requestAuthorized(requestConfig);

    promise
      .then((res) => {
        const action = actionCreators.directChat.setDirectChatsList(
          res.data.direct_chats,
        );
        store.dispatch(action);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    return promise;
  };

  /**
   * Checks If there is an active network connection AND the internet
   * is reachable with the currently active network connection
   * @method checkNetInfo
   * @return {Boolean} - true if both are true. false otherwise
   */
  checkNetInfo = () => {
    const netInfo = store.getState().netInfo;
    return netInfo.isConnected && netInfo.isInternetReachable;
  };

  /**
   * Convert stringified json back to formData type
   * @method toFormData
   * @param {Stringified json} json
   * @return {FormData} data
   */
  toFormData = (json) => {
    const data = new FormData();
    for (let pair of json) {
      data.append(pair[0], pair[1]);
    }
    return data;
  };

  /**
   * Load all the messages for a specific room
   * @function loadSingleRoomsMessages
   */
  loadSingleChatMessages = async (roomId) => {
    const {
      toogleLoadingChatMessages,
      fetchRoomMessages,
      dispatcher,
      captureError,
    } = this;
    toogleLoadingChatMessages(true);
    fetchRoomMessages(roomId).then(
      (res) => {
        //add new messages to redux
        const events = res.data.events;
        const action = actionCreators.directChat.setDirectChatMessages({
          roomId: roomId,
          messages: events,
        });
        //mark room as loaded
        const markAsLoaded = actionCreators.directChat.updateMessagesLoadedStatus(
          roomId,
        );

        dispatcher(action);
        dispatcher(markAsLoaded);

        //Set loadingMessage flag to false
        toogleLoadingChatMessages(false);
      },
      (err) => {
        captureError(err);
        toogleLoadingChatMessages(false);
      },
    );
  };

  /**
   * Toogle loading indicator for displaying that chatList is loaded
   * @function showLoadingChatList
   */
  showLoadingChatList = (show: boolean) => {
    const loading = actionCreators.directChat.setLoading(show);
    this.dispatcher(loading);
  };

  /**
   * Toogle loading indicator on Loading Modal in oder to indicate to the user that we are loading his room
   * @function showLoadingSingleRoom
   */
  showLoadingSingleChat = (show: boolean) => {
    const loading = actionCreators.directChat.setLoadingSingleChat(show);
    this.dispatcher(loading);
  };

  /**
   * Display that messages are loading by dispatching this action
   * @function toogleLoadingMessages
   */
  toogleLoadingChatMessages = (loading: boolean) => {
    const loadingMessages = actionCreators.directChat.loadingMessages(loading);
    this.dispatcher(loadingMessages);
  };

  /**
   * Display that messages are loading by dispatching this action
   * @function toggleLoadingChat
   */
  toggleLoadingChat = (loading: boolean) => {
    const action = actionCreators.directChat.setLoading(loading);
    this.dispatcher(action);
  };

  subscribeOnPusher = async (room) => {
    function addSubscription(subName) {
      const action = actionCreators.directChat.addSubscription(subName);
      store.dispatch(action);
    }

    const pusher = await PusherClient.connect();
    const subName = `private-direct-chat-${room.id}`;
    const chatroomChannel = pusher.subscribe(subName);
    chatroomChannel.bind('pusher:subscription_succeeded', () => {
      addSubscription(subName);
    });
  };

  sendMessage = async (data: any) => {
    const newData = new FormData();
    const {
      ref,
      chat_room,
      message,
      parent_message,
      media_file,
      media_type,
    } = data;

    newData.append('ref', ref);
    newData.append('chat_room', chat_room);
    newData.append('message', message);
    if (media_file) {
      newData.append('media_file', {
        uri: media_file,
        name: media_file.split('/').pop(),
      });
    }
    if (media_type) {
      newData.append('media_type', media_type);
    }
    if (parent_message) {
      newData.append('parent_message', parent_message?.id);
    }

    MixPanelClient.trackEvent(MESSAGE_SENT);
    const config = {
      method: 'POST',
      url: '/direct-chat-messages',
      data: newData,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((res) => {
        const completeMessage = this.createCompletedMessageObject(
          res.data.message,
          media_file,
        );
        const payload = {
          completeMessage,
          lookup: 'ref',
          sentViaLoggedInUser: true,
        };

        const action = actionCreators.directChat.updateSuccessfullySentDirectMessage(
          payload,
        );
        this.dispatcher(action);
        return completeMessage;
      })
      .catch((err) => {
        this.captureError(err);
        return err;
      });
  };

  createCompletedMessageObject = (message, media_file) => {
    if (message.media_type === 1 && message.media_url === null) {
      const newAudioMessage = { ...message, media_url: media_file };
      return newAudioMessage;
    }
    return message;
  };

  fetchDirectRoomMessages = (id) => {
    const { dispatcher } = this;
    const config = {
      method: 'GET',
      url: `/direct-chat-messages?chat_room=${id}`,
    };
    const promise = BackendApiClient.requestAuthorized(config);

    promise
      .then((res) => {
        const messages = res.data.messages;

        const action = actionCreators.directChat.setDirectChatMessages({
          roomId: id,
          messages,
        });
        dispatcher(action);
      })
      .catch((err) => {
        console.log('error: ', err);
      });

    return promise;
  };

  /**
   * Mark a reply as seen when user scrolled to the specific reply via NavigationHelperButton
   * @function postReactions
   * @params {reactions} - Array of reactions that the user has pressed on
   */
  postReactions = async (reactions: Array<Object>) => {
    const data = {
      reactions: reactions,
    };
    const config = {
      method: 'POST',
      url: `/chat-room-message-reactions/bulk`,
      data,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        this.captureError(err);
        return err;
      });
  };

  /**
   * Check if user has reacted to a message
   * @function checkReactionStatus
   * @params {id} - chatroom message id
   */
  checkReactionStatus = async (id: number) => {
    const config = {
      method: 'GET',
      url: `/direct-chat-message/${id}/is-reacted`,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        this.captureError(err);
        return err;
      });
  };

  /**
   * Return a list of all reaction for a single message
   * @function getReactionsSingleMessage
   * @params {id} - chatroom message id
   */
  getReactionsSingleMessage = async (id: number) => {
    const config = {
      method: 'GET',
      url: `/chat-room-message-reactions?direct_chat_message_id=${id}`,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        this.captureError(err);
        return err;
      });
  };

  /**
   * Accept of reject a direct chat
   * @function acceptBlockDirectChat
   * @param {id} - if of direct chat
   * @param {accepted} - describted weather to accept or reject the chat request
   */
  acceptBlockDirectChat = async (id: number, accepted: boolean) => {
    const action = accepted ? 'accept' : 'reject';
    const config = {
      method: 'PUT',
      url: `/direct-chats/${id}/${action}`,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('err acceptBlockDirectChat: ', err);
        this.captureError(err);
        return err;
      });
  };

  /**
   * Find direct chat and navigate to it
   * @function findAndNavigateToDirectChat
   * @param {id} - if of direct chat
   */
  findAndNavigateToDirectChat = (directChatId: number) => {
    const { directChat } = store.getState();
    const directChatIndex = directChat.directChatList.findIndex(
      (chat) => chat.id === directChatId,
    );
    if (directChatIndex < 0) return;
    const directChatRoom = directChat.directChatList[directChatIndex];
    NavigationService.navigate('DirectChatRoomScreen', {
      room: directChatRoom,
      today: true,
      scrollDown: true,
    });
  };
}

export interface DirectChatItemInterface {
  id: number;
  sender: {
    id: string;
    name: string;
    profile_picture_url: string;
    email: string;
    gender: string;
    dayOfBirth: string;
    bio_text: string;
    bio_color: string;
    instagram_link: string;
    prompts: Array<string>;
    country: string;
    phone_number: string;
    createdAt: string;
  };
  receiver: {
    id: string;
    name: string;
    profile_picture_url: string;
    email: string;
    gender: string;
    dayOfBirth: string;
    bio_text: string;
    bio_color: string;
    instagram_link: string;
    prompts: Array<string>;
    country: string;
    phone_number: string;
    createdAt: string;
  };
  status: number;
  created_at: string;
}

export interface DirectChatMessageInterface {
  id: number;
  ref: string;
  chat_room: number;
  user: {
    id: string;
    name: string;
    profile_picture_url: string;
    email: string;
    gender: string;
    dayOfBirth: string;
    bio_text: string;
    bio_color: string;
    instagram_link: string;
    prompts: Array<string>;
    country: string;
    phone_number: string;
    createdAt: string;
  };
  flatten_reactions: [
    {
      id: number;
      app_user: {
        id: string;
        name: string;
        profile_picture_url: string;
        email: string;
        gender: string;
        dayOfBirth: string;
        bio_text: string;
        bio_color: string;
        instagram_link: string;
        prompts: Array<string>;
        country: string;
        phone_number: string;
        createdAt: string;
      };
      emoji: string;
      count: number;
      created_at: string;
      updated_at: string;
      direct_chat_message: number;
    },
  ];
  message: string;
  paper_plane: {
    id: string;
    publicUrl: string;
    publicThumbnailUrl: string;
    publicOverlayUrl: string;
  };
  media_type: number;
  media_url: string;
  created_at: string;
}

export const STATUS_CREATED = 0;
export const STATUS_ACCEPTED = 1;
export const STATUS_REJECTED = 2;

export default new DirectChatsManager();
