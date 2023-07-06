import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ChatRoomInterface} from '../../services/api/ChatRoomManager';
import collect from 'collect.js';
import BackendApiClient from '../../services/api/BackendApiClient';
import {Bugtracker} from '../../services/utility/BugTrackerService';

interface RoomInterface {
  roomData: ChatRoomInterface[];
  loading: boolean;
  loadingSingleRoom: boolean;
  loadingMessages: boolean;
  loadingRemovingMember: boolean;
}

async function reUpload(failedMessage, thunkAPI) {
  const config = {
    method: 'POST',
    url: `/chat-room-messages`,
    data: {
      ...failedMessage,
      parent_message: failedMessage.parent_message.id,
    },
  };

  return BackendApiClient.requestAuthorized(config).then(
    (res) => {
      return {
        failedMessage,
        updatedMessage: {...res.data.message, type: 'message'},
      };
    },
    (err) => {
      Bugtracker.captureException(err, {scope: 'ChatroomSlice'});
    },
  );
}

function findIndexById(source, id) {
  return source.findIndex((element) => element.id === id);
}

function increaseNewMessageCountByOne(newMessage, rooms, roomId) {
  if (!newMessage?.is_approved) return rooms;
  const roomIndex = rooms.findIndex((element) => element.id === roomId);
  const currentNewCount = rooms[roomIndex].new_message_count;
  rooms[roomIndex].new_message_count = currentNewCount + 1;
  return rooms;
}

function increaseMessageCount(newMessage, rooms, roomId) {
  if (!newMessage.is_approved) return rooms;
  const roomIndex = rooms.findIndex((element) => element.id === roomId);
  const currentCount = rooms[roomIndex].message_count;
  rooms[roomIndex].message_count = currentCount + 1;
  return rooms;
}

function checkIfNewConversation(newMessage) {
  return newMessage.parent_message === null;
}

function checkIfElementExist(source, id) {
  const index = source.findIndex((mess) => mess.id == id);
  if (index < 0) return {exist: false, index: null};
  return {exist: true, index};
}

const initialState = {
  roomData: [],
  inactiveRooms: [],
  roomsMessages: {},
  loading: false,
  loadingSingleRoom: false,
  loadingMessages: false,
  subscriptions: [],
};

const extraReducers = {
  [reUpload.fulfilled]: (state, action) => {
    const {updatedMessage, failedMessage} = action.payload;
    const {roomsMessages} = state;

    function findTargetIndex() {
      return roomsMessages[updatedMessage.chat_room].findIndex(
        (message) => message.id === failedMessage.id,
      );
    }

    const targetIndex = findTargetIndex();

    state.roomsMessages[failedMessage.chat_room][targetIndex] = updatedMessage;
  },
};

const reducers = {
  setRooms: (state, action: PayloadAction<ChatRoomInterface[]>) => {
    let currentRoomData = state.roomData;
    let newRoomData = [...action.payload];
    let newMessageArray = [];

    function doesRoomExist(currentRoom) {
      return typeof currentRoom !== 'undefined';
    }

    function calculateDiff(newCount, currentCount) {
      return newCount - currentCount;
    }

    function justAddNewRoom(newRoom) {
      return {...newRoom, is_loaded: false, new_message_count: 0};
    }

    function updateExceptNewMessageCount(roomCurrentData, RoomNewData) {
      return {...roomCurrentData, ...RoomNewData, is_loaded: false};
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
      newRoomData.forEach((room, i) => {
        if (!doesRoomExist(currentRoomData[i])) {
          newRoomData[i] = justAddNewRoom(room);
        } else {
          const message_count_diff = calculateDiff(newRoomData[i].message_count, currentRoomData[i].message_count);
          if (message_count_diff === 0) {
            newRoomData[i] = updateExceptNewMessageCount(currentRoomData[i], room);
          } else {
            const updated_diff = currentRoomData[i].new_message_count + message_count_diff;
            newRoomData[i] = updateRoomData(currentRoomData[i], room, updated_diff);
          }
        }
        if (state.roomsMessages[room.id]) {
          newMessageArray[room.id] = state.roomsMessages[room.id];
        }
      });
      return newRoomData;
    }

    state.roomData = updateRooms();
    state.roomsMessages = newMessageArray;
  },
  setInActiveRooms: (state, action: PayloadAction<ChatRoomInterface[]>) => {
    try {
      state.inactiveRooms = action.payload;
    } catch (error) {
      console.log('Error: ', error);
    }
  },
  addNewRoom: (state: RoomInterface, action: PayloadAction<ChatRoomInterface>) => {
    const {roomData} = state;
    let newRoom = {...action.payload};

    function checkRoomExists() {
      return findIndexById(roomData, newRoom.id);
    }

    const roomExists = checkRoomExists();
    try {
      if (roomExists < 0) {
        newRoom = {...newRoom, is_loaded: false};
        state.roomData.unshift(newRoom);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  },
  deleteRoom: (state, action) => {
    const {roomData, roomsMessages} = state;
    const {id} = action.payload;

    function findIndex() {
      return findIndexById(roomData, id);
    }

    const deleteIndex = findIndex();
    try {
      if (deleteIndex < 0) return;
      const collection = collect(roomData);
      collection.splice(deleteIndex, 1);
      state.roomData = [...collection.all()];
      if (roomsMessages[id] !== undefined) delete state.roomsMessages[id];
    } catch (error) {
      console.log('error: ', error);
    }
  },
  deleteInActiveRoom: (state, action) => {
    const {inactiveRooms} = state;
    const roomId = action.payload;
    try {
      const roomIndex = inactiveRooms.findIndex((room) => room.id === roomId);
      const collection = collect(inactiveRooms);
      collection.splice(roomIndex, 1);
      state.inactiveRooms = collection.all();
    } catch (error) {
      console.log('error: ', error);
    }
  },
  setLoading: (state, action) => {
    state.loading = action.payload;
  },
  setLoadingSingleRoom: (state, action) => {
    state.loadingSingleRoom = action.payload;
  },
  setRoomMessages: (state, action) => {
    const {roomId, messages} = action.payload;
    state.roomsMessages = {...state.roomsMessages, [roomId]: messages};
  },
  addNewMessage: (state, action) => {
    const {newMessage, sentViaLoggedInUser, navigation} = action.payload;
    const {roomsMessages, roomData} = state;
    const roomId = newMessage.chat_room;
    let updateRoom = [...roomData];


    function findParentMessageIndex() {
      return findIndexById(roomsMessages[roomId], newMessage.parent_message);
    }

    function addNewConversation() {
      state.roomsMessages[roomId] = [newMessage, ...roomsMessages[roomId]];
      state.roomData = increaseMessageCount(newMessage, updateRoom, roomId);
      if (!sentViaLoggedInUser) {
        const currentRouteName = navigation.currentRoute.name;
        if (currentRouteName == undefined || currentRouteName !== 'ChatRoom') {
          state.roomData = increaseNewMessageCountByOne(newMessage, updateRoom, roomId);
        }
      }
    }

    function addNewReply(parentMessageIndex) {
      state.roomsMessages[roomId][parentMessageIndex].replies.push(newMessage);
    }

    try {
      if (checkIfNewConversation(newMessage)) {
        addNewConversation();
      } else {
        const parentMessageIndex = findParentMessageIndex();
        addNewReply(parentMessageIndex);
      }
    } catch (e) {
      Bugtracker.captureException(e, {scope: 'ChatroomSlice: addNewMessage'});
    }
  },
  addRoomMember: (state, action) => {
    const {member, roomId} = action.payload;
    const {roomData} = state;

    function findRoomIndex() {
      return findIndexById(roomData, roomId);
    }

    try {
      const roomIndex = findRoomIndex();
      let updateRoom = [...roomData];
      updateRoom[roomIndex].members.unshift(member);
      state.roomData = updateRoom;
    } catch (error) {
      console.log('error:', error);
    }
  },
  updateRoomMember: (state, action) => {
    const {updatedMember, roomId, inactive} = action.payload;
    const {inactiveRooms, roomData} = state;

    function findRoomIndex() {
      if (inactive) {
        return findIndexById(inactiveRooms, roomId);
      } else {
        return findIndexById(roomData, roomId);
      }
    }

    function findMemberIndexByInternalId(rooms, roomIndex, member) {
      return rooms[roomIndex].members.findIndex(
        (user) => user.app_user.internal_id === member.app_user.internal_id,
      );
    }

    try {
      const roomIndex = findRoomIndex();
      let updateRoom = inactive ? [...inactiveRooms] : [...roomData];
      const memberIndex = findMemberIndexByInternalId(updateRoom, roomIndex, updatedMember)
      updateRoom[roomIndex].members[memberIndex] = updatedMember;
      if (inactive) {
        state.inactiveRooms = updateRoom;
      } else {
        state.roomData = updateRoom;
      }
    } catch (error) {
      console.log('error:', error);
    }
  },
  updateRoomMemberAppUser: (state, action) => {
    const {memberAppUser, roomId, inactive} = action.payload;
    const {inactiveRooms, roomData} = state;

    function findRoomIndex() {
      if (inactive) {
        return findIndexById(inactiveRooms, roomId);
      } else {
        return findIndexById(roomData, roomId);
      }
    }

    function findMemberIndexByInternalId(rooms, roomIndex, member) {
      return rooms[roomIndex].members.findIndex(
        (user) => user.app_user.internal_id === member.internal_id,
      );
    }

    try {
      const roomIndex = findRoomIndex();
      let updateRoom = inactive ? [...inactiveRooms] : [...roomData];
      const memberIndex = findMemberIndexByInternalId(updateRoom, roomIndex, memberAppUser)
      updateRoom[roomIndex].members[memberIndex].app_user = memberAppUser;
      if (inactive) {
        state.inactiveRooms = updateRoom;
      } else {
        state.roomData = updateRoom;
      }
    } catch (error) {
      console.log('error:', error);
    }
  },
  updatePoll: (state, action) => {
    let updateRoom = [...state.roomData];
    const {roomData} = state;
    const {vote, room_id} = action.payload;

    function findRoomIndex() {
      return findIndexById(updateRoom, room_id);
    }

    function findVotesIndex(roomIndex) {
      return findIndexById(roomData[roomIndex].votes, Number(vote.id));
    }

    try {
      const roomIndex = findRoomIndex();
      if (roomIndex < 0) return;
      const votesIndex = findVotesIndex(roomIndex);
      if (votesIndex < 0) return;
      let roomVotes = updateRoom[roomIndex].votes;
      roomVotes.forEach((votes, i) => {
        roomVotes[i] = {
          ...votes,
          count: i === votesIndex ? vote.count : votes.count,
          total_count: vote.total_count,
        };
      });
      state.roomData[roomIndex].votes = roomVotes;
    } catch (error) {
      console.log('error: ', error);
    }

  },
  updatePollStatus: (state, action) => {
    let updateRoom = [...state.roomData];
    const {room_id} = action.payload;

    function findRoomIndex() {
      return findIndexById(updateRoom, room_id);
    }

    try {
      const roomIndex = findRoomIndex();
      if (roomIndex < 0) return;
      updateRoom[roomIndex] = {
        ...updateRoom[roomIndex],
        is_voted: !updateRoom[roomIndex].is_voted,
      };
      state.roomData = updateRoom;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  updateMessagesEvents: (state, action) => {
    const {member, roomId} = action.payload;
    const JoinMessage = {
      ...member,
      event: 'room_member.created',
      type: 'member',
    };
    if (state.roomsMessages[roomId] === undefined)
      state.roomsMessages[roomId] = [];
    state.roomsMessages[roomId].unshift(JoinMessage);
  },
  updateRepliesList: (state, action) => {
    const {room_Id, conversationIndex} = action.payload;

    function findReplies() {
      return state.roomsMessages[room_Id][conversationIndex]?.replies;
    }

    const replies = findReplies();
    replies[replies?.length - 1] = {
      ...replies[replies?.length - 1],
      is_seen: true,
    };
  },
  updateMessagesLoadedStatus: (state, action) => {
    let newRoomData = [...state.roomData];

    function findRoomIndex() {
      return findIndexById(newRoomData, action.payload);
    }

    const roomIndex = findRoomIndex();
    try {
      if (roomIndex >= 0)
        newRoomData[roomIndex] = {...newRoomData[roomIndex], is_loaded: true};
      state.roomData = newRoomData;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  updateSuccessfullySentMessage: (state, action) => {
    const {completeMessage, lookup, sentViaLoggedInUser} = action.payload;
    const chatroomId = completeMessage.chat_room;

    const {roomsMessages} = state;
    let updateRoom = [...state.roomData];

    function findParentIndex() {
      return findIndexById(
        roomsMessages[chatroomId],
        completeMessage.parent_message,
      );
    }

    function findParentAndItsReplies(parentIndex) {
      // find the parent and its replies
      let parent = roomsMessages[chatroomId][parentIndex];
      let parentReplies = parent?.replies;
      return parentReplies;
    }

    function findTargetReplyIndex(parentReplies) {
      return parentReplies.findIndex(
        (element) => element.ref === completeMessage.ref,
      );
    }

    function findTargetIndex() {
      // when message is approved, `lookup` is `id`, when normal message is updated, `lookup` is `ref`
      return findIndexById(roomsMessages[chatroomId], completeMessage[lookup]);
    }

    try {
      // if the message is a reply
      if (completeMessage.parent_message !== null) {
        const parentIndex = findParentIndex();
        const parentReplies = findParentAndItsReplies(parentIndex);
        const targetReplyIndex = findTargetReplyIndex(parentReplies);
        // update the reply
        state.roomsMessages[chatroomId][parentIndex].replies[targetReplyIndex] = completeMessage;
      } else {
        // if the message is a new conversation
        const targetIndex = findTargetIndex();
        state.roomsMessages[chatroomId][targetIndex] = completeMessage;
        state.roomData = increaseMessageCount(
          completeMessage,
          updateRoom,
          chatroomId,
        );
      }
    } catch (e) {
      Bugtracker.captureException(e, {
        scope: 'ChatroomSlice: updateSuccessfullySentMessage',
      });
    }
  },
  loadingMessages: (state, action) => {
    state.loadingMessages = action.payload;
  },
  resetNewMessageCount: (state, action) => {
    const {roomId} = action.payload;
    const {roomData} = state;
    let updateRoom = [...roomData];

    function findRoomIndex() {
      return findIndexById(roomData, roomId);
    }

    try {
      const roomIndex = findRoomIndex();
      updateRoom[roomIndex].new_message_count = 0;
      state.roomData = updateRoom;
    } catch (error) {
      console.log('error: ', error);
    }

  },
  deleteMessage: (state, action) => {
    const {roomsMessages} = state;
    const message = action.payload;
    const roomId = message.chat_room;

    function deleteMessage(messagesClone, removeIndex) {
      const deletedMessages = messagesClone.splice(removeIndex, 1);
      return messagesClone;
    }

    function findParentMessageIndex(message) {
      return findIndexById(roomsMessages[roomId], message.parent_message);
    }

    function handleNewConversationDeletion() {
      const {exist, index} = checkIfElementExist(roomsMessages[roomId], message.id)
      if (exist) {
        let messagesClone = [...roomsMessages[roomId]];
        const updatedMessages = deleteMessage(messagesClone, index);
        state.roomsMessages[roomId] = updatedMessages;
      }
    }

    function handleReplyDeletion() {
      const parentMessageIndex = findParentMessageIndex(message);
      let repliesClone = roomsMessages[roomId][parentMessageIndex].replies;
      const {exist, index} = checkIfElementExist(repliesClone, message.id);
      if (exist) {
        const updatedReplies = deleteMessage(repliesClone, index);
        state.roomsMessages[roomId][
          parentMessageIndex
          ].replies = updatedReplies;
      }
    }

    try {
      if (checkIfNewConversation(message)) {
        handleNewConversationDeletion();
      } else {
        handleReplyDeletion();
      }
    } catch (e) {
      Bugtracker.captureException(e, {scope: 'ChatroomSlice: deleteMessage'});
    }
  },
  updateMessageReactions: (state, action) => {
    const {reactions, message, hasReacted} = action.payload;
    const roomId = message?.chat_room;

    function findMessageIndex(id) {
      const index = state.roomsMessages[roomId].findIndex(
        (element) => element.id === id,
      );
      return index;
    }

    function findReplyIndex(messageIndex, id) {
      const index = state.roomsMessages[roomId][messageIndex].replies.findIndex(
        (element) => element.id === id,
      );
      return index;
    }

    function updateMessage(
      messageIndex,
      newFlattenReaction,
      total_users_reacted,
    ) {
      state.roomsMessages[roomId][messageIndex] = {
        ...state.roomsMessages[roomId][messageIndex],
        flatten_reactions: newFlattenReaction,
        total_users_reacted: total_users_reacted,
      };
    }

    function updateReply(
      messageIndex,
      replyIndex,
      newFlattenReaction,
      total_users_reacted,
    ) {
      state.roomsMessages[roomId][messageIndex].replies[replyIndex] = {
        ...state.roomsMessages[roomId][messageIndex].replies[replyIndex],
        flatten_reactions: newFlattenReaction,
        total_users_reacted: total_users_reacted,
      };
    }


    function LoginUserPostsReaction() {
      let flattenReactions = new Set(message.flatten_reactions);
      reactions.forEach((element) => {
        //Update flattenreaction list
        flattenReactions.add(element.emoji);
      });
      if (message.parent_message === null) {
        //Find messageIndex
        const messageIndex = findMessageIndex(message?.id);
        if (messageIndex < 0) return;
        //Update flatten messages
        const newFlattenReaction = Array.from(flattenReactions);
        let newCount =
          state.roomsMessages[roomId][messageIndex].total_users_reacted;
        const total_users_reacted = !hasReacted ? (newCount += 1) : newCount;
        updateMessage(messageIndex, newFlattenReaction, total_users_reacted);
        return;
      } else {
        const messageIndex = findMessageIndex(message?.parent_message);
        const replyIndex = findReplyIndex(messageIndex, message.id);
        const newFlattenReaction = Array.from(flattenReactions);
        let newCount =
          state.roomsMessages[roomId][messageIndex].replies[replyIndex]
            .total_users_reacted;
        const total_users_reacted = !hasReacted ? (newCount += 1) : newCount;
        updateReply(
          messageIndex,
          replyIndex,
          newFlattenReaction,
          total_users_reacted,
        );
      }
    }

    function OutsideUserPostsReaction() {
      if (message.parent_message === null) {
        const messageIndex = findMessageIndex(message?.id);
        const roomID = message.chat_room;
        state.roomsMessages[roomID][messageIndex] = message;
        return;
      }
      const messageIndex = findMessageIndex(message?.parent_message);
      const roomID = message.chat_room;
      const replyIndex = findReplyIndex(messageIndex, message?.id);
      state.roomsMessages[roomID][messageIndex].replies[replyIndex] = message;
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
  extendRoom: (state: RoomInterface, action) => {
    const roomId = action.payload;
    const roomIndex = findIndexById(state.roomData, roomId);

    function updateRoomExtension() {
      state.roomData[roomIndex].is_extended = true;
    }

    try {
      updateRoomExtension();
    } catch (error) {
      console.log('Error extending room: ', error);
    }
  },
  addSubscription: (state, action) => {
    state.subscriptions.push(action.payload)
  },
  removeSubscription: (state, action) => {
    state.subscriptions = []
  }
};

export default createSlice({
  name: 'chatRoom',
  initialState,
  extraReducers,
  reducers,
});

export const chatRoomProps = (state) => state.chatRoom;

export const doReUpload = createAsyncThunk('chatRoom/reUpload', reUpload);

export interface ChatRoomStatePropsInterface {
  roomData: ChatRoomInterface[];
  loading: boolean;
  loadingSingleRoom: boolean;
  loadingMessages: boolean;
}

export interface ChatRoomActionsPropsInterface {
  setRooms: (payload: ChatRoomInterface[]) => void;
  addNewRoom: (payload: ChatRoomInterface) => void;
  setLoading: () => void;
  setLoadingSingleRoom: () => void;
  updateMessagesEvents: () => void;
  updateRoomMemberAppUser: () => void;
}

export interface ChatRoomPropsInterface
  extends ChatRoomStatePropsInterface,
    ChatRoomActionsPropsInterface {
}
