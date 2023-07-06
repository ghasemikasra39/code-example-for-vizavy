import PusherClient from './PusherClient';
import {store} from '../../store';
import {actionCreators} from '../../store/actions';
import ChatRoomManager from '../api/ChatRoomManager';


export default async function publicPusherBinder() {

  /**
   * Add a single inspiration to redux
   * @function createInspiration
   * @param {InspirationInterface} data - the inspiration object
   */
  function createInspiration(data) {
    const action = actionCreators.inspirations.addInspiration(data);
    store.dispatch(action);
  }

  /**
   * Update a single inspiration
   * @function createInspiration
   * @param {InspirationInterface} data - the inspiration object
   */
  function updateInspiration(data) {
    const deleteAction = actionCreators.inspirations.deleteInspiration(data);
    const createAction = actionCreators.inspirations.addInspiration(data);
    store.dispatch(deleteAction);
    store.dispatch(createAction);
  }

  /**
   * Delete a single inspiration
   * @function deleteInspiration
   * @param {InspirationInterface} data - the inspiration object
   */
  function deleteInspiration(data) {
    const action = actionCreators.inspirations.deleteInspiration(data);
    store.dispatch(action);
  }

  /**
   * Reorder the inspirations
   * @function reorderInspiration
   * @param {Object} data - an object containing the index array
   */
  function reorderInspiration(data) {
    const action = actionCreators.inspirations.reorderInspiration(data);
    store.dispatch(action);
  }

  /**
   * Add room to rooms list
   * @function addNewAnnouncementRoom
   * @param {Object} data - an object containing the room data
   */
  function addNewAnnouncementRoom(data) {
    const action = actionCreators.chatRoom.addNewRoom(data);
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
   * Add a new member to announcement room when he joins the room
   * @function addMember
   * @param {array} data - member object
   */
  function addMember(data) {
    const {userProfile, chatRoom} = store.getState();
    const {roomData} = chatRoom;
    //Check if roomMember already exists in roomsList
    const roomIndex = roomData.findIndex((element) => element.id === data.chat_room);
    if (roomIndex < 0) return
    const roomMemberExits = roomData[roomIndex]?.members.findIndex((element) => element.app_user.id === data.app_user.id);
    //If room member does not exist
    if (roomMemberExits < 0) {
      const action = actionCreators.chatRoom.addRoomMember({roomId: data.chat_room, member: data});
      store.dispatch(action);
    }

    //Check if member exists in messages
    const messageMemberExists = chatRoom.roomsMessages[data.chat_room].findIndex((element) => element.type === "member" && element.app_user.id === data.app_user.id);

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
   * Update the poll when someone voted in announcement room
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

  function bindPublicListeners(systemChannel) {
    systemChannel.bind('inspiration.created', (data) => {
      createInspiration(data);
    });

    systemChannel.bind('inspiration.deleted', (data) => {
      deleteInspiration(data);
    });

    systemChannel.bind('inspiration.updated', (data) => {
      updateInspiration(data);
    });

    systemChannel.bind('inspiration.reordered', (data) => {
      reorderInspiration(data);
    });

    systemChannel.bind('inspiration.reordered', (data) => {
      reorderInspiration(data);
    });

    systemChannel.bind('room.created', (data) => {
      addNewAnnouncementRoom(data);
    });

    systemChannel.bind('room.updated', (data) => {
      //Inser function here
    });

    systemChannel.bind('room.deleted', (data) => {
      removeAnnouncementRoom(data);
    });

    systemChannel.bind('room_member.created', (data) => {
      addMember(data);
    });

    systemChannel.bind('room_member.deleted', (data) => {
      removeMember(data);
    });

    systemChannel.bind('room_member.voted', (data) => {
      updatePool(data);
    });
  }

  const pusher = await PusherClient.connect();
  const systemChannel = pusher.subscribe('private-system');
  systemChannel.bind('pusher:subscription_succeeded', () => {
    bindPublicListeners(systemChannel)
  });
  return pusher;
}
