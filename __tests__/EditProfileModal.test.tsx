import React from 'react';
import {Alert, FlatList} from 'react-native';
import {shallow} from 'enzyme';
import moxios from 'moxios'
import {findByTestAttr, storeFactory} from '../utils/testUtils';
import EditProfileModal from '../src/modals/EditProfileModal';


const initialState = {
  appStatus: {
    userProfileInitialized: false,
    pushNotifAllowed: true,
    locationAllowed: true,
    initialLocationModalDisplayed: true,
  },
  userProfile: {},
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
};
const defaultProps = {}
const mockedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      goBack: mockedGoBack,
    })
  };
});

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
  return shallow(<EditProfileModal {...setupProps} />)
}

test('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-updateProfileScreen')
  expect(component.length).toBe(1);
});

describe('Update profile image', () => {
  let wrapper;
  let AlertMock;
  let onPress;
  const token = '72f1b1fb123a004f429ebb85385b8e1ba75bea31ff0a0d3caf14a4d4b886cddef3e55469c53e18c4e8bb02005985d6115c807c8a48426a57ac02bb186a4a1a17';
  const title = '🤖 Moderation Alert 🤖';
  const message = 'Your content looks suggestive. Please upload another image. We can’t review all images, so we gotta rely on our moderation bot.';
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

    wrapper = setup();
    onPress = wrapper.dive().find(FlatList).props().ListHeaderComponent.props.children[0].props.onPress;
    onPress()
  });

  afterEach(() => {
    moxios.uninstall()
    AlertMock.mockClear();
    mockedGoBack.mockClear();
  })

  describe('the uploaded image is suggestive', () => {

    beforeEach(async () => {
      await respondWith(400, {message});
    })

    test('the update button is found', () => {
      expect(typeof onPress).toBe("function");
    })

    test('the Alert appears', () => {
      expect(AlertMock).toBeCalledTimes(1)
    });
    test('the Alert contains the correct message', () => {
      expect(AlertMock).toHaveBeenCalledWith(title, message, buttons, options)
    });
    test('the user stays on the screen', () => {
      expect(mockedGoBack).toHaveBeenCalledTimes(0)
    });
  });

  describe('the uploaded image is NOT suggestive', () => {
    beforeEach(async () => {
      await respondWith(200, {
        profile: {
          id: "some id"
        }
      });
    })

    test('the Alert does not appear', () => {
      expect(AlertMock).toBeCalledTimes(0)
    });
  })
})




