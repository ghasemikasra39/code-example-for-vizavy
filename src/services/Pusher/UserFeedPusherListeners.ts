import PusherClient from './PusherClient';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import { AppState } from 'react-native';
import ChatRoomManager from '../api/ChatRoomManager';
import NotificationPopupHelper from '../utility/NotificationPopupHelper';
import {
  NOTIFICATION_TYPE_PAPERPLANE_UPVOTE,
  TYPE_FRIENDSHIP_REQUEST_APPROVED,
  TYPE_CHAT_ROOM_CREATED,
  TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED,
  TYPE_CHAT_ROOM_EXTENDED,
  TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED,
  TYPE_ROOM_ABOUT_TO_EXPIRE,
  TYPE_GREETINGS,
  TYPE_NEW_FRIENDSHIP_REQUEST,
} from '../api/PushNotificationSubscriber';

export default async function userFeedPusherBinder() {
  function showNotificationsPopUp(notification) {
    NotificationPopupHelper.show(notification);
  }
  /**
   * Add new room created by people I follow
   * @function addNewRoom
   * @param {array} data - data of incoming room
   */
  function addNewRoom(data: any) {
    const action = actionCreators.chatRoom.addNewRoom(data);
    store.dispatch(action);
  }

  function addNewDirectChat(data) {
    const loggedInUserId = store.getState().userProfile.id;
    const senderId = data.sender.id;
    const action = actionCreators.directChat.addNewDirectChat({
      direct_chat: data,
      amIDirectOwner: loggedInUserId == senderId,
    });
    store.dispatch(action);
  }

  /**
   * Delete room from rooms list
   * @function removeAnnouncementRoom
   * @param {Object} data - an object containing the room data
   */
  function removeAnnouncementRoom(data) {
    const action = actionCreators.chatRoom.deleteRoom({
      id: data.id,
    });
    store.dispatch(action);
  }

  /**
   * Update user roles to Admin, ChatRoomManager
   * @function updateUserRoles
   * @param {array} data - data for new Roles array
   */
  function updateUserRoles(data: any) {
    const action = actionCreators.userProfile.updateRoles(data);
    store.dispatch(action);
  }

  /**
   * Add a new member to a room when he joins the room
   * @function addMember
   * @param {array} data - member object
   */
  function addMember(data) {
    const { userProfile, chatRoom } = store.getState();
    const { roomData } = chatRoom;
    //Check if roomMember already exists in roomsList
    const roomIndex = roomData.findIndex(
      (element) => element.id === data.chat_room,
    );
    if (roomIndex < 0) return;
    const roomMemberExits = roomData[roomIndex]?.members.findIndex(
      (element) => element.app_user.id === data.app_user.id,
    );

    //If room member does not exist
    if (roomMemberExits < 0) {
      const action = actionCreators.chatRoom.addRoomMember({
        roomId: data.chat_room,
        member: data,
      });
      store.dispatch(action);
    }

    //Check if member exists in messages
    const messageMemberExists = chatRoom.roomsMessages[
      data.chat_room
    ].findIndex(
      (element) =>
        element.type === 'member' && element.app_user.id === data.app_user.id,
    );

    if (messageMemberExists < 0) {
      const updateMessagesEventsAction = actionCreators.chatRoom.updateMessagesEvents(
        {
          roomId: data.chat_room,
          member: data,
        },
      );
      store.dispatch(updateMessagesEventsAction);
    }
  }

  async function removeMember(data) {
    //Set removingMember state to true in order to display a loading indicator on ChatRoomScreen
    const startRemoving = actionCreators.chatRoom.removingMember(true);
    store.dispatch(startRemoving);

    //Refresh the roomsList
    ChatRoomManager.getRoomsListAsync();

    //Refresh the messages from BE
    await ChatRoomManager.fetchRoomMessages(data.chat_room);

    //Set removingMember state to false in order to hide the loading indicator on ChatRoomScreen
    const endRemoving = actionCreators.chatRoom.removingMember(false);
    store.dispatch(endRemoving);
  }

  /**
   * Update the poll when someone voted
   * @function updatePool
   * @param {array} data - includes the votes object
   */
  function updatePool(data) {
    const action = actionCreators.chatRoom.updatePoll({
      room_id: data.room_id,
      vote: data.data,
    });
    store.dispatch(action);
  }

  function addNewNotification(data) {
    const { navigation, appStatus } = store.getState();
    const appIsFocused = appStatus.appState?.current === 'active';
    if (!appIsFocused) return;
    switch (data?.type) {
      case NOTIFICATION_TYPE_PAPERPLANE_UPVOTE:
      case TYPE_GREETINGS:
      case TYPE_CHAT_ROOM_CREATED:
      case TYPE_NEW_FRIENDSHIP_REQUEST:
      case TYPE_FRIENDSHIP_REQUEST_APPROVED:
      case TYPE_ROOM_ABOUT_TO_EXPIRE:
      case TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED:
      case TYPE_CHAT_ROOM_EXTENDED:
      case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
        const action = actionCreators.notifications.addNewNotification({
          newMessage: data,
          navigation,
        });
        store.dispatch(action);
        break;
    }
    showNotificationsPopUp(data);
  }

  function addNewFriendshipRequest(data) {
    const action = actionCreators.notifications.addNewFriendshipRequest(data);
    store.dispatch(action);
  }

  async function pusherConnectChatrooms(pusher) {
    function amImessageOwner(newMessage) {
      const userProfile = store.getState().userProfile;
      const userId = userProfile.id;
      if (newMessage.app_user.id === userId) {
        return true;
      } else {
        return false;
      }
    }

    function addMessage(data) {
      const { userProfile, navigation } = store.getState();
      const userId = userProfile.id;
      const newMessageId = data.app_user.id;

      if (userId !== newMessageId) {
        const action = actionCreators.chatRoom.addNewMessage({
          newMessage: data,
          sentViaLoggedInUser: userId == newMessageId,
          navigation,
        });
        store.dispatch(action);
      }
    }

    function addDirectChatMessage(data) {
      const { userProfile, navigation } = store.getState();
      const userId = userProfile.id;
      const newMessageId = data.app_user.id;

      if (userId !== newMessageId) {
        const action = actionCreators.directChat.addNewDirectMessage({
          newMessage: data,
          sentViaLoggedInUser: userId == newMessageId,
          navigation,
        });
        store.dispatch(action);
      }
    }

    function updateMessage(data) {
      const action = actionCreators.chatRoom.updatePoll({
        poll: data,
      });
      store.dispatch(action);
    }

    function deleteMessage(data) {
      const action = actionCreators.chatRoom.deleteMessage(data);
      store.dispatch(action);
    }

    function approveMessage(data) {
      // we are using `updateSuccessfullySentMessage`, `successful` here means `is_approved = true`
      const sentViaLoggedInUser = amImessageOwner(data);
      const action = actionCreators.chatRoom.updateSuccessfullySentMessage({
        completeMessage: data,
        lookup: 'id',
        sentViaLoggedInUser,
      });
      store.dispatch(action);
    }

    function addReactions(data) {
      const action = actionCreators.chatRoom.updateMessageReactions({
        message: data,
      });
      store.dispatch(action);
    }

    function addDirectChatReactions(data) {
      const action = actionCreators.directChat.updateMessageReactions({
        message: data,
      });
      store.dispatch(action);
    }

    function hasJoined(room) {
      const userId = store.getState().userProfile.id;
      const members = room.members;
      const index = members.findIndex((member) => member.app_user.id == userId);
      return index >= 0;
    }

    function cleanPreviousSubscriptions() {
      store.dispatch(actionCreators.chatRoom.removeSubscription());
      store.dispatch(actionCreators.directChat.removeSubscription());
    }

    function processArray(items, process) {
      let todo = items.concat();

      setTimeout(function () {
        process(todo.shift());
        if (todo.length > 0) setTimeout(arguments.callee, 25);
      }, 25);
    }

    function initialSubscriber(room) {
      const subName = `private-chat-room-${room.id}`;
      const alreadyJoined = hasJoined(room);

      if (alreadyJoined) {
        const chatroomChannel = pusher.subscribe(subName);

        chatroomChannel.bind('pusher:subscription_succeeded', function () {
          // console.log('succeeded: ', subName)
        });

        chatroomChannel.bind('pusher:subscription_error', function (err) {
          console.log('subscription_error: ', err);
        });

        const action = actionCreators.chatRoom.addSubscription(subName);
        store.dispatch(action);
      }
    }

    function initialDirectChatsSubscriber(room) {
      const subName = `private-direct-chat-${room.id}`;
      if (room.status == 1 || room.sender.id == userProfile.id) {
        const directChatChannel = pusher.subscribe(subName);
        directChatChannel.bind('pusher:subscription_succeeded', function () {
          // console.log('succeeded: ', subName)
        });

        directChatChannel.bind('pusher:subscription_error', function (err) {
          console.log('subscription_error: ', err);
        });

        const action = actionCreators.directChat.addSubscription(subName);
        store.dispatch(action);
      }
    }

    function bindListeners() {
      pusher.bind('chat_room_message.created', (data) => {
        addMessage(data);
      });
      pusher.bind('direct_chat_message.created', (data) => {
        addDirectChatMessage(data);
      });
      pusher.bind('chat_room_message.updated', (data) => {
        updateMessage(data);
      });
      pusher.bind('chat_room_message.deleted', (data) => {
        deleteMessage(data);
      });
      pusher.bind('chat_room_message.approved', (data) => {
        approveMessage(data);
      });
      pusher.bind('chat_room_message_reaction.created', (data) => {
        addReactions(data);
      });
      pusher.bind('direct_chat_message_reaction.created', (data) => {
        addDirectChatReactions(data);
      });
    }

    cleanPreviousSubscriptions();
    const { chatRoom, directChat } = store.getState();
    if (chatRoom.roomData.length > 0)
      processArray(chatRoom.roomData, initialSubscriber);
    if (directChat.directChatList.length > 0)
      processArray(directChat.directChatList, initialDirectChatsSubscriber);

    bindListeners();
  }

  function bindUserFeedListeners(userFeedChannel) {
    userFeedChannel.bind('room.created', (data) => {
      addNewRoom(data);
    });

    userFeedChannel.bind('direct_chat.created', (data) => {
      addNewDirectChat(data);
    });

    userFeedChannel.bind('room.deleted', (data) => {
      removeAnnouncementRoom(data);
    });

    userFeedChannel.bind('room.updated', (data) => {
      //Add update function here
    });

    userFeedChannel.bind('user.roles_updated', (data) => {
      updateUserRoles(data);
    });

    userFeedChannel.bind('room_member.created', (data) => {
      addMember(data);
    });

    userFeedChannel.bind('room_member.deleted', (data) => {
      removeMember(data);
    });

    userFeedChannel.bind('room_member.voted', (data) => {
      updatePool(data);
    });

    userFeedChannel.bind('notification.created', (data) => {
      addNewNotification(data);
    });

    userFeedChannel.bind('friendship_request.created', (data) => {
      addNewFriendshipRequest(data);
    });
  }

  function cleanAndUnbindSubscriptions(pusher) {
    const { chatRoom, directChat } = store.getState();
    chatRoom.subscriptions.forEach((subName) => pusher.unsubscribe(subName));
    directChat.subscriptions.forEach((subName) => pusher.unsubscribe(subName));

    store.dispatch(actionCreators.chatRoom.removeSubscription());
    store.dispatch(actionCreators.directChat.removeSubscription());
    pusher.unbind();
  }

  const { userProfile } = store.getState();
  const pusher = await PusherClient.connect();

  pusher.connection.bind('error', function (err) {
    console.log('err: ', err);
  });

  pusher.connection.bind('state_change', function (states) {
    // console.log('states: ', states)
  });

  const userFeedChannel = pusher.subscribe(
    `private-user-feed-${userProfile.internal_id}`,
  );
  userFeedChannel.bind('pusher:subscription_succeeded', () => {
    bindUserFeedListeners(userFeedChannel);
  });
  await pusherConnectChatrooms(pusher);

  AppState.addEventListener('change', (status) => {
    const appState = store.getState()?.appStatus?.appState;
    if (appState?.prev === 'background' && status === 'active')
      pusherConnectChatrooms(pusher);
    if (status == 'background') cleanAndUnbindSubscriptions(pusher);
  });

  return pusher;
}
