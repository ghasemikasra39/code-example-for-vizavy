import BackendApiClient from './BackendApiClient';
import FormData from 'react-native/Libraries/Network/FormData';
import { store } from '../../store';
import { Bugtracker } from '../utility/BugTrackerService';
import { actionCreators } from '../../store/actions';
import { StackActions } from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AuthorizationManager from '../auth/AuthorizationManager';
import NavigationService from '../utility/NavigationService';
import MixPanelClient, {
  CREATE_ROOM,
  JOIN_ROOM,
  MESSAGE_SENT,
  CREATE_PUBLIC_ROOM,
  CREATE_PRIVATE_ROOM,
} from '../utility/MixPanelClient';
import { Alert } from 'react-native';
import FriendshipManager from './FriendshipManager';
import PusherClient from '../Pusher/PusherClient';
import { getTimeDifference } from '../../screens/ChatRoom/ChatroomUtils';

class ChatRoomManager {
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

  /**
   * Create a new chatRoom for users
   * @method createChatRoomAsync
   */
  createChatRoomAsync = async ({
    title,
    answer_options,
    invited_users,
    excluded_users,
    color_1,
    color_2,
    is_announcement,
    is_public,
    is_writable,
    message,
    media_file,
    media_type,
  }: createRoomParams) => {
    const { errorDispatcher } = this;
    this.toggleLoadingRooms(true);
    const data = new FormData();
    data.append('title', title);
    if (answer_options) {
      data.append('answer_options', answer_options);
    }
    if (invited_users) {
      invited_users.forEach((userId) => {
        data.append('invited_users[]', userId);
      });
    }
    if (excluded_users) {
      excluded_users.forEach((userId) => {
        data.append('excluded_users[]', userId);
      });
    }
    if (color_1) {
      data.append('color_1', color_1);
    }
    if (color_2) {
      data.append('color_2', color_2);
    }
    if (is_announcement) {
      data.append('is_announcement', is_announcement);
    }
    if (is_public) {
      data.append('is_public', is_public);
    }

    if (is_writable) {
      data.append('is_writable', is_writable);
    }
    if (message) {
      data.append('message', message);
    }
    if (media_file) {
      data.append('media_file', {
        uri: media_file,
        name: media_file.split('/').pop(),
      });
    }
    if (media_type) {
      data.append('media_type', media_type);
    }

    const config = {
      method: 'POST',
      url: '/chat-rooms/tmp',
      data,
    };
    return BackendApiClient.requestAuthorizedAsync(config).then(
      (response) => {
        if (!response) {
          this.toggleLoadingRooms(false);
          return null;
        }
        this.addRoomToRedux(response.data.room);
        this.toggleLoadingRooms(false);
        MixPanelClient.trackEvent(CREATE_ROOM);
        if (response.data.room.is_public) {
          MixPanelClient.trackEvent(CREATE_PUBLIC_ROOM);
        } else {
          MixPanelClient.trackEvent(CREATE_PRIVATE_ROOM);
        }
        return response.data;
      },
      (error) => {
        if (error.response.status === 404) {
          const action = actionCreators.popup.setPopup({
            enable: true,
            state: '',
            message: 'Please check your internet connection',
          });
          errorDispatcher(action, error);
        }
        return false;
      },
    );
  };

  /**
   * Add the created room to redux
   * @method addRoomToRedux
   * @param {rooms: Object} - created room object
   */
  addRoomToRedux = (rooms) => {
    const action = actionCreators.chatRoom.addNewRoom(rooms);
    this.dispatcher(action);
  };

  /**
   * Loads the data for the list of chatrooms
   * @method getRoomsListAsync
   * @param {startdate: string} - Return a list of all rooms starting from the startDate
   */

  getRoomsListAsync = async (startDate?: string) => {
    const { dispatcher, errorDispatcher } = this;
    this.showLoadingRooms(true);
    const url = '/chat-rooms';
    const queryUrl = url + '?start_date=' + startDate;
    const config = { method: 'GET', url: startDate ? queryUrl : url };

    return BackendApiClient.requestAuthorizedAsync(config).then(
      (response) => {
        if (!response) {
          this.showLoadingRooms(false);
          return null;
        }
        if (!startDate) {
          // const requestConfig = {url: 'direct-chats', method: "GET"}

          // BackendApiClient.requestAuthorized(requestConfig)
          //   .then(res => {
          //     const combinedData = response.data.rooms.concat(res.data.chats)
          //
          dispatcher({
            type: 'chatRoom/setRooms',
            payload: response.data.rooms,
          });
        } else {
          const action = actionCreators.chatRoom.setInActiveRooms(
            response.data.rooms,
          );
          dispatcher(action);
        }
        this.showLoadingRooms(false);
        return response.data;
      },
      (error) => {
        this.showLoadingRooms(false);
        if (error.response.status === 404) {
          const action = actionCreators.popup.setPopup({
            enable: true,
            state: '',
            message: 'Please check your internet connection',
          });
          errorDispatcher(action, error);
        }
        return false;
      },
    );
  };

  /**
   * Deletes a single room
   * @method deleteSingleChatRoomAsync
   * @params {id} - id of room
   */
  deleteSingleChatRoomAsync = async (id: number) => {
    const { errorDispatcher } = this;
    const config = {
      method: 'DELETE',
      url: `/chat-rooms/${id}`,
    };
    return BackendApiClient.requestAuthorizedAsync(config).then(
      (response) => {
        if (!response) return null;
        return response.data;
      },
      (error) => {
        if (error.response.status === 404) {
          const action = actionCreators.popup.setPopup({
            enable: true,
            state: '',
            message: 'Please check your internet connection',
          });
          errorDispatcher(action, error);
        }
        return false;
      },
    );
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
   * Get the dynamic link that the user has opened the app with
   * @method handleDynamicLinkForground
   */
  handleDynamicLink = async () => {
    const { dispatcher, getRoomByLink } = this;

    function handler(link) {
      const str = link.url;
      let inviteLink;
      //Check if link is an referral link
      if (str.includes('ref')) {
        inviteLink = str.split('https://www.youpendo.com?ref=')[1];
        updateInviteLinkReferralRedux();
      } else {
        //Link is for chatroom
        inviteLink = Number(str.split('https://www.youpendo.com?id=')[1]);
        updateInviteLinkForChatRoomRedux();
        getRoomByLink(inviteLink);
      }

      function updateInviteLinkForChatRoomRedux() {
        dispatcher({
          type: 'appStatus/setdynamicLink',
          payload: inviteLink,
        });
      }

      function updateInviteLinkReferralRedux() {
        dispatcher({
          type: 'referrals/setInviteLink',
          payload: inviteLink,
        });
      }
    }

    function getDLAppFG() {
      //Get dynamic link when app is in forground mode
      dynamicLinks().onLink(handler);
    }

    function getDLAppKilled() {
      //Get dynamic link when app is opened from a killed state
      dynamicLinks().getInitialLink().then(handler);
    }

    getDLAppFG();
    getDLAppKilled();
  };

  /**
   * Load the room the user has been invited to by invite link and navigate him to it
   * @param {id : number} - id of room
   * @function getRoomByLink
   */
  getRoomByLink = async (id: number) => {
    const follow = true;

    //Check to see if the room has already been loaded in the list.
    if (await AuthorizationManager.isUserTokenPresentAsync())
      this.fetchAndNavigateToRoom(id, follow);
  };

  navigateToChatRoomScreen = async (id, follow?: boolean) => {
    const state = store.getState();
    const { followThroughInviteLink, fetchAndNavigateToRoom } = this;

    function findRoomIndex() {
      return state.chatRoom.roomData.findIndex((element) => element.id === id);
    }

    const roomIndex = findRoomIndex();

    if (roomIndex > -1) {
      const chatRoom = state.chatRoom.roomData[roomIndex];
      //Check and see if the active room is actually already expired.
      //This can happen in rare occasions when a user opens a room via push notification that is actually already expired
      const extentedExpirationTime = chatRoom?.is_extended ? 24 : 0;
      const timeDifference =
        getTimeDifference(chatRoom?.created_at, 'asHours') +
        extentedExpirationTime;
      if (timeDifference <= 0 && !chatRoom?.is_onboarding) {
        this.showRoomExpiredAlert();
        return;
      }

      NavigationService.navigate('ChatRoom', {
        room: chatRoom,
        scrollDown: true,
      });
      if (follow) {
        followThroughInviteLink(
          state.chatRoom.roomData[roomIndex].app_user.internal_id,
        );
      }
    } else {
      await fetchAndNavigateToRoom(id, follow);
    }
  };

  /**
   * Loads the data for rooms and navigates the user to a specific room
   * @method fetchAndNavigateToRoom
   * @params {id} - id of room
   * @params follow - wheater I should follow the host of the chatRoom
   */
  fetchAndNavigateToRoom = async (id: number, follow?: boolean) => {
    const {
      joinBeforeEnteringRoom,
      getRoomsListAsync,
      followThroughInviteLink,
      clearDynamicLink,
      captureError,
      showRoomExpiredAlert,
      showLoadingSingleRoom,
    } = this;

    function findRoomIndex(roomsList) {
      return roomsList.findIndex((element) => element.id === id);
    }

    function handler(response) {
      const { rooms, success } = response;
      if (!success) {
        failureHandler();
        return;
      }
      showLoadingSingleRoom(false);

      const room_index = findRoomIndex(rooms);
      if (room_index > -1) {
        const ref = NavigationService.getNavigatorRef();
        const pushAction = StackActions.push('ChatRoom', {
          room: rooms[room_index],
          scrollDown: true,
        });
        ref.current.dispatch(pushAction);
      } else {
        showRoomExpiredAlert();
      }
      clearDynamicLink();
      if (!follow) return;
      const userId = rooms.rooms[room_index].app_user.internal_id;
      followThroughInviteLink(userId);
    }

    function failureHandler() {
      showLoadingSingleRoom(false);
      clearDynamicLink();
    }

    function handleFetch() {
      getRoomsListAsync().then(handler);
    }

    showLoadingSingleRoom(true);
    const joinedRoom = await joinBeforeEnteringRoom(id, follow);
    if (!joinedRoom) {
      showLoadingSingleRoom(false);
      return;
    }
    handleFetch();
  };

  /**
   * Load all the messages for a specific room
   * @function loadSingleRoomsMessages
   */
  loadSingleRoomsMessages = async (roomId) => {
    const {
      toogleLoadingMessages,
      fetchRoomMessages,
      dispatcher,
      captureError,
    } = this;
    toogleLoadingMessages(true);
    fetchRoomMessages(roomId).then(
      (res) => {
        //add new messages to redux
        const events = res.data.events;
        const action = actionCreators.chatRoom.setRoomMessages({
          roomId: roomId,
          messages: events,
        });
        //mark room as loaded
        const markAsLoaded = actionCreators.chatRoom.updateMessagesLoadedStatus(
          roomId,
        );

        dispatcher(action);
        dispatcher(markAsLoaded);

        //Set loadingMessage flag to false
        toogleLoadingMessages(false);
      },
      (err) => {
        captureError(err);
        toogleLoadingMessages(false);
      },
    );
  };

  /**
   * When a user enters the chat through an invite link, the user will automatically follow the creator of the room
   * @function followThroughInviteLink
   */
  followThroughInviteLink = async (id: number) => {
    const response = await FriendshipManager.sendFriendshipRequest(id);
    return response;
  };

  /**
   * When a user enters the chat through an invite link, the user will have to join the room first before entering the room so that he can fetch the correct list of rooms
   * @function joinBeforeEnteringRoom
   */
  joinBeforeEnteringRoom = async (id: number, joinViaInviteLink?: boolean) => {
    const data = {
      is_from_invite_link: joinViaInviteLink ? joinViaInviteLink : false,
    };
    const requestConfig = {
      method: 'POST',
      url: `/chat-rooms/${id}/join`,
      data,
    };
    return BackendApiClient.requestAuthorized(requestConfig).then(
      (response) => {
        const { first_join, success } = response.data;
        if (first_join) this.subscribeOnPusher(id);
        return success;
      },
    );
  };

  /**
   * Toogle loading indicator for displaying that rooms are loaded
   * @function showLoadingRooms
   */
  showLoadingRooms = (show: boolean) => {
    const loading = actionCreators.chatRoom.setLoading(show);
    this.dispatcher(loading);
  };

  /**
   * Toogle loading indicator on Loading Modal in oder to indicate to the user that we are loading his room
   * @function showLoadingSingleRoom
   */
  showLoadingSingleRoom = (show: boolean) => {
    const loading = actionCreators.chatRoom.setLoadingSingleRoom(show);
    this.dispatcher(loading);
  };

  /**
   * Clear dynamic link
   * @function clearDynamicLink
   */
  clearDynamicLin = () => {
    const link = actionCreators.appStatus.setdynamicLink(null);
    this.dispatcher(link);
  };

  /**
   * Display that messages are loading by dispatching this action
   * @function toogleLoadingMessages
   */
  toogleLoadingMessages = (loading: boolean) => {
    const loadingMessages = actionCreators.chatRoom.loadingMessages(loading);
    this.dispatcher(loadingMessages);
  };

  /**
   * Display that rooms are loading by dispatching this action
   * @function toggleLoadingRooms
   */
  toggleLoadingRooms = (loading: boolean) => {
    const action = actionCreators.chatRoom.setLoading(loading);
    this.dispatcher(action);
  };

  /**
   * Show room expired alert
   * @function showRoomExpiredAlert
   */
  showRoomExpiredAlert = () => {
    Alert.alert(
      '🙁',
      'The room you are looking for seems to be expired. Rooms get deleted after 24h',
      [{ text: 'OK' }],
    );
  };

  subscribeOnPusher = async (id) => {
    function addSubscription(subName) {
      const action = actionCreators.chatRoom.addSubscription(subName);
      store.dispatch(action);
    }

    const pusher = await PusherClient.connect();
    const subName = `private-chat-room-${id}`;
    const chatroomChannel = pusher.subscribe(subName);
    chatroomChannel.bind('pusher:subscription_succeeded', () =>
      addSubscription(subName),
    );
  };

  joinRoom = async (currentRoom, userProfile) => {
    const successHandler = (response) => {
      if (!response.data.success) return;
      const { data } = response;
      if (data.first_join) {
        this.subscribeOnPusher(currentRoom.id);
        const action = actionCreators.chatRoom.addRoomMember({
          roomId: currentRoom.id,
          member: data.member,
        });
        this.dispatcher(action);
      }
    };

    MixPanelClient.trackEvent(JOIN_ROOM);

    const config = {
      method: 'POST',
      url: `/chat-rooms/${currentRoom.id}/join`,
    };
    return BackendApiClient.requestAuthorized(config).then(
      successHandler,
      (err) => this.captureError(err),
    );
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
      directChatroom,
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
      url: '/chat-room-messages',
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

        const action = actionCreators.chatRoom.updateSuccessfullySentMessage(
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

  fetchRoomMessages = (id) => {
    const { dispatcher, toogleLoadingMessages, captureError } = this;
    const config = {
      method: 'GET',
      url: `/chat-room-events?chat_room_id=${id}`,
    };
    return BackendApiClient.requestAuthorized(config).then(
      (res) => {
        const events = res.data.events;
        const action = actionCreators.chatRoom.setRoomMessages({
          roomId: id,
          messages: events,
        });
        const markAsLoaded = actionCreators.chatRoom.updateMessagesLoadedStatus(
          id,
        );
        dispatcher(action);
        dispatcher(markAsLoaded);

        toogleLoadingMessages(false);
        if (!events) return null;
        return events;
      },
      (err) => {
        toogleLoadingMessages(false);
        captureError(err);
        return null;
      },
    );
  };

  vote = async (id: number, choice: number) => {
    const data = new FormData();
    data.append('answer', choice);
    const config = {
      method: 'POST',
      url: `/chat-rooms/${id}/votes`,
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
      url: `/chat-room-messages/${id}/is-reacted`,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('err: ', err);
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
      url: `/chat-room-message-reactions?chat_room_message_id=${id}`,
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
   * Mark a reply as seen when user scrolled to the specific reply via NavigationHelperButton
   * @function markReplyAsSeen
   * @params {id} - id of reply
   */
  markReplyAsSeen = async (id: number) => {
    const config = {
      method: 'POST',
      url: `/chat-room-messages/${id}/mark-seen`,
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

  removeMemberFromRoom = async (id: number) => {
    //Set removeMember state to true so that a loading indictor gets displayed on ChatroomScreen
    const startRemoving = actionCreators.chatRoom.removingMember(true);
    store.dispatch(startRemoving);

    //Perform API call to block the user
    return BackendApiClient.requestAuthorized({
      method: 'POST',
      url: `/chat-room-members/${id}/block`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        //In case there is an error, set removingMember to true in order to hide the loading indicator on the ChatRoomScreen
        const endRemoving = actionCreators.chatRoom.removingMember(false);
        store.dispatch(endRemoving);
        return err;
      });
  };

  /**
   * Extend a room for another 24 hrs
   * @function extendRoom
   * @params {id} - id of room
   */
  extendRoom = async (id: number) => {
    const data = {
      chat_room_id: id,
    };
    const config = {
      method: 'POST',
      url: `/chat-room-extension`,
      data,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        const action = actionCreators.chatRoom.extendRoom(id);
        store.dispatch(action);
        return response.data;
      })
      .catch((err) => {
        this.captureError(err);
        return err;
      });
  };

  muteUnmuteNotification = (muteNotification, currentRoom, loggedInMember) => {
    const whatToDo = muteNotification ? 'mute' : 'unmute';
    const requestConfig = {
      method: 'GET',
      url: `/chat-rooms/${currentRoom.id}/${whatToDo}`,
    };
    return BackendApiClient.requestAuthorized(requestConfig)
      .then((res) => {
        const updatedMember = {
          ...loggedInMember,
          is_room_muted: muteNotification,
        };
        const action = actionCreators.chatRoom.updateRoomMember({
          updatedMember,
          roomId: currentRoom.id,
          inactive: false,
        });
        this.dispatcher(action);
        return res.data;
      })
      .catch((err) => {
        console.log('err: ', err);
        return err;
      });
  };
}

export interface MessageInterface {
  type: string;
  id: 0;
  app_user: {
    id: string;
    name: string;
    profile_picture_url: string;
    email: string;
    location: {
      country: string;
      country_code: string;
      city: string;
      createdAt: string;
    };
    day_of_birth: string;
    createdAt: string;
  };
  parent_message: number;
  replies: [];
  reactions: Array<object>;
  flatten_reactions: Array<string>;
  total_users_reacted: number;
  message: string;
  media_url: any;
  media_type: number;
  seen_by_users: [
    {
      id: string;
      name: string;
      profile_picture_url: string;
      email: string;
      location: {
        country: string;
        country_code: string;
        city: string;
        createdAt: string;
      };
      day_of_birth: string;
      createdAt: string;
    },
  ];
  created_at: string;
  sent: boolean;
  is_approved: boolean;
}

export interface ChatRoomInterface {
  answer_options: [string];
  appUser: {
    id: string;
    name: string;
    profile_picture_url: string;
    email: string;
    location: {
      country: string;
      country_code: string;
      city: string;
      createdAt: any;
    };
    day_of_birth: any;
    createdAt: any;
  };
  color_1: string;
  color_2: string;
  created_at: any;
  id: number;
  invite_link: string;
  is_announcement: boolean;
  is_onboarding: boolean;
  is_voted: boolean;
  is_writable: boolean;
  is_extended: boolean;
  approved_at: string;
  is_rejected: boolean;
  members: [
    {
      id: number;
      chat_room: number;
      appUser: {
        id: string;
        name: string;
        profile_picture_url: string;
        email: string;
        location: {
          country: string;
          country_code: string;
          city: string;
          createdAt: any;
        };
        day_of_birth: any;
        createdAt: any;
      };
      is_blocked: boolean;
      createdAt: any;
    },
  ];
  title: string;
  uuid: string;
  votes: [
    {
      id: string;
      text: string;
      count: string;
      total_count: string;
    },
  ];
}

interface createRoomParams {
  title: string;
  answer_options?: any;
  invited_users?: Array<number>;
  excluded_users?: Array<number>;
  color_1?: string;
  color_2?: string;
  is_announcement?: boolean;
  is_public?: boolean;
  is_writable?: boolean;
  message?: string;
  media_file?: any;
  media_type?: number;
}

export default new ChatRoomManager();
