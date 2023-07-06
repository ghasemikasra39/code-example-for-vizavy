import { createSlice } from '@reduxjs/toolkit';
import { Bugtracker } from '../../services/utility/BugTrackerService';
import DirectChatsManager, {
  DirectChatItemInterface,
  DirectChatMessageInterface,
} from '../../services/api/DirectChatsManager';

function findIndexById(source, id) {
  return source.findIndex((element) => element.id === id);
}

const initialState = {
  directChatList: [],
  directChatMessages: {},
  currentActiveRoom: null,
  loading: false,
  loadingSingleRoom: false,
  loadingMessages: false,
  subscriptions: [],
};

const reducers = {
  setDirectChatsList: (state, action) => {
    let currentRoomData = state.directChatList;
    let newRoomData = [...action.payload];
    let newRoomDataClone = [];
    let newMessageArray = [];

    function doesRoomExist(currentRoom) {
      return typeof currentRoom !== 'undefined';
    }

    function calculateDiff(newCount, currentCount) {
      return newCount - currentCount;
    }

    function justAddNewRoom(newRoom) {
      return {
        ...newRoom,
        is_loaded: false,
        new_message_count: newRoom.message_count,
      };
    }

    function updateExceptNewMessageCount(roomCurrentData, RoomNewData) {
      return { ...roomCurrentData, ...RoomNewData, is_loaded: false };
    }

    function updateRoomData(roomCurrentData, roomNewData, updated_diff) {
      return {
        ...roomCurrentData,
        ...roomNewData,
        is_loaded: false,
        new_message_count: updated_diff,
      };
    }

    function updateRooms() {
      newRoomData.forEach((newRoom, i) => {
        const index = currentRoomData.findIndex((currentRoom, j) => {
          return currentRoom.id == newRoom.id;
        });
        if (index < 0) {
          newRoomDataClone.push(justAddNewRoom(newRoom));
        } else {
          const message_count_diff = calculateDiff(
            newRoom.message_count,
            currentRoomData[index].message_count,
          );
          if (message_count_diff === 0) {
            newRoomDataClone.push(
              updateExceptNewMessageCount(currentRoomData[index], newRoom),
            );
          } else {
            const updated_diff =
              currentRoomData[index].new_message_count + message_count_diff;
            newRoomDataClone.push(
              updateRoomData(currentRoomData[index], newRoom, updated_diff),
            );
          }
        }
      });
      return newRoomDataClone;
    }

    state.directChatList = updateRooms();
  },
  addNewDirectChat: (state, action) => {
    const { directChatList } = state;
    const { direct_chat, amIDirectOwner } = action.payload;
    try {
      const chatIndex = findIndexById(directChatList, direct_chat?.id);
      const newDirectChat = {
        ...direct_chat,
        new_message_count: amIDirectOwner ? 0 : direct_chat.message_count,
      };

      if (chatIndex < 0) {
        directChatList.unshift(newDirectChat);
        DirectChatsManager.subscribeOnPusher(direct_chat);
      } else {
        directChatList[chatIndex] = newDirectChat;
      }
    } catch (error) {
      console.log('error addNewDirectChat:', error);
    }
  },
  setLoading: (state, action) => {
    state.loading = action.payload;
  },
  setLoadingSingleChat: (state, action) => {
    state.loadingSingleChat = action.payload;
  },
  setDirectChatMessages: (state, action) => {
    const { roomId, messages } = action.payload;
    state.directChatMessages = {
      ...state.directChatMessages,
      [roomId]: messages,
    };
  },
  addNewDirectMessage: (state, action) => {
    const {
      newMessage,
      sentViaLoggedInUser,
      navigation,
      replyToPaperPlane,
    } = action.payload;
    const { directChatMessages, directChatList, currentActiveRoom } = state;
    const roomId = newMessage.chat_room;
    let updateRoom = [...directChatList];

    function increaseMessageCount(newMessage, rooms, roomId) {
      const roomIndex = rooms.findIndex((element) => element.id === roomId);
      const currentCount = rooms[roomIndex].message_count;
      rooms[roomIndex].message_count = currentCount + 1;
      return rooms;
    }

    function increaseNewMessageCountByOne(newMessage, rooms, roomId) {
      const roomIndex = rooms.findIndex((room) => room.id === roomId);
      const currentNewCount = rooms[roomIndex].new_message_count;
      rooms[roomIndex].new_message_count = currentNewCount + 1;
      return rooms;
    }

    function addNewConversation() {
      state.directChatMessages[roomId] ||
        (state.directChatMessages[roomId] = []);

      state.directChatMessages[roomId] = [
        newMessage,
        ...directChatMessages[roomId],
      ];
      const targetChatroomIndex = state.directChatList.findIndex(
        (directChat) => directChat.id == roomId,
      );
      state.directChatList[targetChatroomIndex].last_message = newMessage;
      if (!replyToPaperPlane) {
        state.directChatList = increaseMessageCount(
          newMessage,
          updateRoom,
          roomId,
        );
      }

      if (!sentViaLoggedInUser) {
        const currentRouteName = navigation.currentRoute.name;
        if (currentRouteName == undefined || currentActiveRoom?.id !== roomId) {
          state.directChatList = increaseNewMessageCountByOne(
            newMessage,
            updateRoom,
            roomId,
          );
        }
      }
    }

    addNewConversation();
  },
  updateMessagesLoadedStatus: (state, action) => {
    let newRoomData = [...state.directChatList];

    function findRoomIndex() {
      return findIndexById(newRoomData, action.payload);
    }

    const roomIndex = findRoomIndex();
    try {
      if (roomIndex >= 0)
        newRoomData[roomIndex] = { ...newRoomData[roomIndex], is_loaded: true };
      state.directChatList = newRoomData;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  updateSuccessfullySentDirectMessage: (state, action) => {
    const { completeMessage, lookup } = action.payload;
    const chatroomId = completeMessage.chat_room;

    const { directChatMessages } = state;

    function findTargetIndex() {
      return findIndexById(
        directChatMessages[chatroomId],
        completeMessage[lookup],
      );
    }

    try {
      const targetIndex = findTargetIndex();
      directChatMessages[chatroomId][targetIndex] = completeMessage;
      // state.roomData = increaseMessageCount(completeMessage, updateRoom, chatroomId);
    } catch (e) {
      Bugtracker.captureException(e, {
        scope: 'ChatroomSlice: updateSuccessfullySentMessage',
      });
    }
  },
  loadingMessages: (state, action) => {
    state.loadingMessages = action.payload;
  },
  updateMessageReactions: (state, action) => {
    const { reactions, message, hasReacted } = action.payload;
    const roomId = message?.chat_room;
    const { directChatMessages } = state;

    function findMessageIndex(id) {
      const index = directChatMessages[roomId].findIndex(
        (element) => element.id === id,
      );
      return index;
    }

    function updateMessage(messageIndex, newFlattenReaction) {
      state.directChatMessages[roomId][messageIndex] = {
        ...state.directChatMessages[roomId][messageIndex],
        flatten_reactions: newFlattenReaction,
      };
    }

    function LoginUserPostsReaction() {
      let flattenReactions = new Set(message.flatten_reactions);
      reactions.forEach((element) => {
        //Update flattenreaction list
        flattenReactions.add(element.emoji);
      });
      //Find messageIndex
      const messageIndex = findMessageIndex(message?.id);
      if (messageIndex < 0) return;
      //Update flatten messages
      const newFlattenReaction = Array.from(flattenReactions);
      updateMessage(messageIndex, newFlattenReaction);
    }

    function OutsideUserPostsReaction() {
      const messageIndex = findMessageIndex(message?.id);
      const roomID = message.chat_room;
      state.directChatMessages[roomID][messageIndex] = message;
    }

    try {
      if (reactions) {
        LoginUserPostsReaction();
      } else {
        OutsideUserPostsReaction();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  },
  setAcceptBlock: (state, action) => {
    const { direct_chat, accepted } = action.payload;
    const { directChatList } = state;
    try {
      const directChatIndex = findIndexById(directChatList, direct_chat?.id);
      if (accepted) {
        state.directChatList[directChatIndex] = {
          ...direct_chat,
          new_message_count: 0,
        };
      } else {
        state.directChatList.splice(directChatIndex, 1);
      }
    } catch (error) {
      console.log('error setAcceptBlock:', error);
    }
  },
  enterChat: (state, action) => {
    const chatId = action.payload;
    const { directChatList } = state;
    try {
      const directChatIndex = findIndexById(directChatList, chatId);
      state.directChatList[directChatIndex] = {
        ...state.directChatList[directChatIndex],
        is_loaded: true,
      };
    } catch (error) {
      console.log('error enterChat: ', error);
    }
  },
  addSubscription: (state, action) => {
    state.subscriptions.push(action.payload);
  },
  removeSubscription: (state) => {
    state.subscriptions = [];
  },
  resetNewMessageCount: (state, action) => {
    const { roomId } = action.payload;
    const { directChatList } = state;
    let updateRoom = [...directChatList];

    function findRoomIndex() {
      return findIndexById(directChatList, roomId);
    }

    try {
      const roomIndex = findRoomIndex();
      updateRoom[roomIndex].new_message_count = 0;
      state.directChatList = updateRoom;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  setCurrentActiveRoom: (state, action) => {
    state.currentActiveRoom = action.payload;
  },
};

export default createSlice({
  name: 'directChat',
  initialState,
  reducers,
});

export const directChatProps = (state) => state.chatRoom;

export interface DirectChatStatePropsInterface {
  directChatList: DirectChatItemInterface[];
  directChatMessages: DirectChatMessageInterface;
  currentActiveRoom: DirectChatItemInterface;
  loading: boolean;
  loadingSingleRoom: boolean;
  loadingMessages: boolean;
}

export interface DirectChatPropsInterface
  extends DirectChatStatePropsInterface {}
