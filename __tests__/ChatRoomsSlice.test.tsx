import React from 'react';
import {storeFactory} from '../utils/testUtils';
import chatRoomsSlice from '../src/store/slices/ChatRoomsSlice';

const actions = chatRoomsSlice.actions;

describe('setRooms reducer: new message count update', () => {
  let store;
  let dispatch;
  let getState;
  const initialState = {
    chatRoom: {
      roomData: [
        {
          id: 1318,
          message: 'Gruppe 2',
          message_count: 4,
          is_loaded: false,
          new_message_count: 0,
        },
        {
          id: 1317,
          message: 'Gruppe 1',
          message_count: 6,
          is_loaded: false,
          new_message_count: 0,
        },
      ],
      roomsMessages: {
        1317: [],
        1318: [],
        1319: [],
      },
    },
  };

  beforeEach(() => {
    store = storeFactory(initialState);
    dispatch = store.dispatch;
    getState = store.getState;
  });

  test('increase new_message_count by 1 when we have a new message', () => {
    const receivedData = [
      {
        id: 1318,
        message: 'Gruppe 2',
        message_count: 5,
      },
      {
        id: 1317,
        message: 'Gruppe 1',
        message_count: 6,
      },
    ];
    const action = actions.setRooms(receivedData);
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;
    const latestRoom = newRoomData[0];
    const secondRoom = newRoomData[1];

    expect(latestRoom.new_message_count).toBe(1);
    expect(secondRoom.new_message_count).toBe(0);
  });

  test('add new room with new_message_count property equal to 0', () => {
    const receivedData = [
      {
        id: 1319,
        message: 'Gruppe 3',
        message_count: 4,
      },
      {
        id: 1318,
        message: 'Gruppe 2',
        message_count: 5,
      },
      {
        id: 1317,
        message: 'Gruppe 1',
        message_count: 6,
      },
    ];
    const action = actions.setRooms(receivedData);
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;

    expect(newRoomData.length).toBe(receivedData.length);
    expect(newRoomData[0].new_message_count).toBe(0);
  });
});

describe('setRooms reducer: new message count update when unseen messages already exist', () => {
  let store;
  let dispatch;
  let getState;
  const initialState = {
    chatRoom: {
      roomData: [
        {
          id: 1318,
          message: 'Gruppe 2',
          message_count: 4,
          is_loaded: false,
          new_message_count: 2, // already unseen messages
        },
        {
          id: 1317,
          message: 'Gruppe 1',
          message_count: 6,
          is_loaded: false,
          new_message_count: 0,
        },
      ],
      roomsMessages: {
        1317: [],
        1318: [],
        1319: [],
      },
    },
  };

  beforeEach(() => {
    store = storeFactory(initialState);
    dispatch = store.dispatch;
    getState = store.getState;
  });

  test('increase new_message_count when 2 more new messages arrive', () => {
    const receivedData = [
      {
        id: 1318,
        message: 'Gruppe 2',
        message_count: 6, // 2 more new messages
      },
      {
        id: 1317,
        message: 'Gruppe 1',
        message_count: 6,
      },
    ];
    const action = actions.setRooms(receivedData);
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;

    const latestRoom = newRoomData[0];
    const secondRoom = newRoomData[1];

    expect(latestRoom.new_message_count).toBe(4);
    expect(secondRoom.new_message_count).toBe(0);
  });
});

describe('addNewMessage reducer: update new_message_count when a new conversation arrives via Pusher or logged-in user send out a message', () => {
  let store;
  let dispatch;
  let getState;
  const initialState = {
    chatRoom: {
      roomData: [
        {
          id: 1318,
          message: 'Gruppe 2',
          message_count: 4,
          is_loaded: false,
          new_message_count: 0,
        },
        {
          id: 1317,
          message: 'Gruppe 1',
          message_count: 6,
          is_loaded: false,
          new_message_count: 0,
        },
      ],
      roomsMessages: {
        1318: [],
        1317: [],
      },
    },
  };
  const receivedMessage = {
    id: 9989,
    app_user: {id: 'd6b970eb-f4cc-44ac-93c8-371f0af3bdb0'},
    chat_room: 1318,
    parent_message: null,
    type: 'message',
    is_approved: true,
  };

  beforeEach(() => {
    store = storeFactory(initialState);
    dispatch = store.dispatch;
    getState = store.getState;
  });
  test('other user send out a message to the latest room while the receiver is OUTSIDE a chat room', () => {
    const action = actions.addNewMessage({
      newMessage: receivedMessage,
      sentViaLoggedInUser: false,
      navigation: {currentRoute: {name: 'notChatRoom'}}
    });
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;
    const latestRoom = newRoomData[0];

    expect(latestRoom.new_message_count).toBe(1);
    expect(latestRoom.message_count).toBe(5);
  });

  test('other user send out a message to the latest room while the receiver is INSIDE a chat room', () => {
    const action = actions.addNewMessage({
      newMessage: receivedMessage,
      sentViaLoggedInUser: false,
      navigation: {currentRoute: {name: 'ChatRoom'}}
    });
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;
    const latestRoom = newRoomData[0];

    expect(latestRoom.new_message_count).toBe(0);
    expect(latestRoom.message_count).toBe(5);

  });

  test('logged-in user send out a message', () => {
    const action = actions.addNewMessage({
      newMessage: receivedMessage,
      sentViaLoggedInUser: true,
      navigation: {currentRoute: {name: 'notChatRoom'}}
    });
    dispatch(action);
    const newState = getState();
    const newRoomData = newState.chatRoom.roomData;
    const latestRoom = newRoomData[0];

    expect(latestRoom.new_message_count).toBe(0);
    expect(latestRoom.message_count).toBe(5);
  });
});

describe('deleteMessage', () => {
  let store;
  let dispatch;
  let getState;
  const initialState = {
    chatRoom: {
      roomsMessages: {
        1385: [
          {
            type: 'message',
            id: 10676,
            chat_room: 1385,
            parent_message: null,
            replies: [],
          },
          {
            type: 'message',
            id: 10677,
            chat_room: 1385,
            parent_message: null,
            replies: [
              {
                type: 'message',
                id: 10698,
                chat_room: 1385,
                parent_message: 10677,
              },
            ],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    store = storeFactory(initialState);
    dispatch = store.dispatch;
    getState = store.getState;
  });

  test('delete new conversation', () => {
    const messageToBeDeleted = {
      type: 'message',
      id: 10676,
      chat_room: 1385,
      parent_message: null,
      replies: [],
    };
    const action = actions.deleteMessage(messageToBeDeleted);
    dispatch(action);
    const newState = getState();
    const index = newState.chatRoom.roomsMessages[
      messageToBeDeleted.chat_room
      ].findIndex((mess) => mess.id == messageToBeDeleted.id);
    expect(index).toBe(-1);
  });

  test('delete reply', () => {
    const replyToBeDeleted = {
      type: 'message',
      id: 10698,
      chat_room: 1385,
      parent_message: 10677,
    };
    const action = actions.deleteMessage(replyToBeDeleted);
    dispatch(action);
    const newState = getState();
    const index = newState.chatRoom.roomsMessages[
      replyToBeDeleted.chat_room
      ][1].replies.findIndex((reply) => reply.id == replyToBeDeleted.id);
    expect(index).toBe(-1);
  });
});
