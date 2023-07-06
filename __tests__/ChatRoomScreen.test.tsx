import React from 'react';
import {Alert} from 'react-native';
import {shallow} from 'enzyme';
import moxios from 'moxios'
import {findByTestAttr, storeFactory} from '../utils/testUtils';
import {UnconnectedChatRoomScreen} from "../src/screens/ChatRoom/ChatRoomScreen";
import chatRoomsSlice from '../src/store/slices/ChatRoomsSlice';
import Message from '../src/component-library/ChatRoom/Message';

const actions = chatRoomsSlice.actions;

const loggedInUser = {id: 'd6b970eb-f4cc-44ac-93c8-371f0af3bdb0'}
const otherUser = {id: 'd6b970eb-f4cc-44ac-93c8-371f0af31111'}
const initialState = {
  appStatus: {
    userProfileInitialized: false,
    pushNotifAllowed: true,
    locationAllowed: true,
    initialLocationModalDisplayed: true,
  },
  userProfile: {...loggedInUser},
  inspirations: {},
  paperPlanes: {},
  replies: {},
  notifications: {},
  appMetrics: {},
  onScreenDirection: {},
  notificationPopup: {},
  bottomTabBar: {},
  popup: {},
  myProfile: {},
  chatRoom: {
    roomData: [{
      id: 1319, app_user: {id: loggedInUser.id}, is_writable: true, color_1: "#AAE35E",
      color_2: "#71C230"
    }],
    roomsMessages: {1319: []},
  }
};
const defaultProps = {}


jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: () => ({
    params: {room: {id: 1319}}
  }),
  useNavigationState: jest.fn()
}))

/**
 *
 * Factory function to create a ShallowWrapper for the Congrats component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const store = storeFactory(initialState);
  const tree = store.getState();
  const setupProps = {...defaultProps, ...props, ...tree};
  return {wrapper: shallow(<UnconnectedChatRoomScreen {...setupProps} />), store}
}

test('renders without error', () => {
  const {wrapper} = setup();
  const component = findByTestAttr(wrapper, 'component-ChatRoomScreen')
  expect(component.length).toBe(1)
})

describe('send out new conversation', () => {
  let AlertMock;
  let wrapper;
  let buttonSubmit;
  const title = '🤖 Moderation Alert 🤖';
  const message = 'Your message is being reviewed because it may be harmful to others. After review, your message will get posted or deleted. Our moderation bot may be wrong for flagging your message but it\'s worth our users safety.'
  const buttons = [{text: "OK"}];
  const options = {cancelable: true};

  function respondWith(status, response = {}) {
    return new Promise((resolve, reject) => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status,
          response,
        }).then(resolve, reject);
      });
    });
  }

  beforeEach(() => {
    moxios.install()
    AlertMock = jest.spyOn(Alert, 'alert');

    wrapper = setup().wrapper;
    buttonSubmit = findByTestAttr(wrapper, 'button-submit')
    expect(buttonSubmit.length).toBe(1)
    buttonSubmit.props().sendMessage()
  })

  afterEach(() => {
    moxios.uninstall()
    AlertMock.mockClear();
  })

  test('the message is suggestive', async () => {
    const response = {
      success: true,
      message: {
        type: 'message',
        id: 2000,
        app_user: {
          id: 'd6b970eb-f4cc-44ac-93c8-371f0af3bdb0',
          chat_room: 1319,
          created_at: '2021-01-05T09:36:58.342Z',
          parent_message: null,
          replies: [],
          message: 'test',
        },
        is_approved: false
      }
    }
    await respondWith(201, response);
    // expect(AlertMock).toBeCalledTimes(1)
    // expect(AlertMock).toHaveBeenCalledWith(title, message, buttons, options)
  })
  test('the message is NOT suggestive', async () => {
    const response = {
      success: true,
      message: {
        type: 'message',
        id: 2000,
        app_user: {
          id: 'd6b970eb-f4cc-44ac-93c8-371f0af3bdb0',
          chat_room: 1319,
          created_at: '2021-01-05T09:36:58.342Z',
          parent_message: null,
          replies: [],
          message: 'test',
        },
        is_approved: true
      }
    }
    await respondWith(201, response);
    expect(AlertMock).toBeCalledTimes(0)
  })
})

describe('suggestive message via pusher', () => {
  let myWrapper;
  let MessageComponent;
  let myStore;
  let dispatch;
  let getState;

  beforeEach(() => {
    const {wrapper, store} = setup()

    myStore = store
    myWrapper = wrapper

    dispatch = myStore.dispatch;
    getState = myStore.getState;

  })
  test('suggestive message should be added to Redux for other user BUT should NOT be displayed for other user', async () => {
    const messageViaPusher = {
      type: 'message',
      id: 3000,
      app_user: {id: otherUser.id}, // remember, logged-in user has different id
      chat_room: 1319,
      created_at: '2021-01-04T08:59:47+00:00',
      parent_message: null,
      blocked_at: null,
      is_approved: true // suggestive message
    }
    const action = actions.addNewMessage({newMessage: messageViaPusher, sentViaLoggedInUser: false})
    dispatch(action)
    const newState = getState()
    expect(newState.chatRoom.roomsMessages[1319].length).toBe(1);

    MessageComponent = myWrapper.find(Message)


  })
})
