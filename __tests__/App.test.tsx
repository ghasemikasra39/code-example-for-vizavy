import React from 'react';
import moxios from 'moxios';
import axios from 'axios';
import App from '../src/App';
import TestScreen from '../src/screens/TestScreen';
import { actionCreators } from '../src/store/actions';
import { setup, findByTestAttr, storeFactory } from '../utils/testUtils';

test('render without errors', () => {
  const wrapper = setup(<App />);
  const component = findByTestAttr(wrapper, 'component-app');
  expect(component.length).toBe(1);
});

describe('TestScreen related tests', () => {
  let wrapper;
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
  beforeEach(() => {
    const store = storeFactory(initialState);
    wrapper = setup(<TestScreen store={store} />)
      .dive()
      .dive();
  });

  test('render without errors', () => {
    const component = findByTestAttr(wrapper, 'component-app');
    expect(component.length).toBe(1);
  });
});

describe('MyProfile PP are fetched and update the redux correctly', () => {
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
  const expectedResponse = {
    success: true,
    paper_planes: {
      data: [
        {
          id: '1d406143-44dc-4461-b318-e8895bc563cd',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 1,
            text: '',
            active: true,
            position: 0,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/11f01302-4ecc-40fe-9419-116b8716ce36/ff8888a5304fe38e7e6b798e4eb3a36f95a17bc5_1584615366.png',
          },
          publicUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/9c16339b61654ba58eec5462ede74467011189f7.jpeg',
          publicThumbnailUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/b74552857bda431ae96064360caa97a73bb73f56.jpeg',
          publicOverlayUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/e78dd1aa27f61b5747713c810b7d1b94f3d7cce6.png',
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-08T09:57:48+00:00',
          type: 'image',
          comments: 0,
          upVotes: 4,
        },
        {
          id: '73438057-660a-4206-981b-4de11872ed82',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 38,
            text: '',
            active: true,
            position: 1,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/a0137a04-8601-11ea-9d6a-0aa72f686f6c/be9fb58648777407406433d51c35f90a31e30083_1587715360.png',
          },
          publicUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/67a01a50ebafbdf3bba444d87ba1eaba00055e50.jpeg',
          publicThumbnailUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/8345d15c18e5c8af77fdb1a01c11d7c19e9a30e1.jpeg',
          publicOverlayUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/b5cdb36fcce04f5ae74dff4d7158170742b0ef05.png',
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-01T16:09:02+00:00',
          type: 'image',
          comments: 0,
          upVotes: 6,
        },
        {
          id: '64b9b0d3-cf51-4136-98e3-22379a15e9ee',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 1,
            text: '',
            active: true,
            position: 0,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/11f01302-4ecc-40fe-9419-116b8716ce36/ff8888a5304fe38e7e6b798e4eb3a36f95a17bc5_1584615366.png',
          },
          publicUrl: null,
          publicThumbnailUrl: null,
          publicOverlayUrl: null,
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-01T15:59:29+00:00',
          type: 'image',
          comments: 1,
          upVotes: 7,
        },
        {
          id: '93746b70-f122-4559-8511-155e31e42f4d',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 1,
            text: '',
            active: true,
            position: 0,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/11f01302-4ecc-40fe-9419-116b8716ce36/ff8888a5304fe38e7e6b798e4eb3a36f95a17bc5_1584615366.png',
          },
          publicUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/bd087168d131103c29a90860fdc09ff66a1a87a2.jpeg',
          publicThumbnailUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/1e5c032e4022d1e352a141a28dbe26f0b4b51a6c.jpeg',
          publicOverlayUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/8d12f38040d6f187c3e4c90e4a2a0248622ec74c.png',
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-01T15:08:28+00:00',
          type: 'image',
          comments: 1,
          upVotes: 7,
        },
        {
          id: 'b8a5dd0d-05b4-4d2d-876e-a125acb2409e',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 1,
            text: '',
            active: true,
            position: 0,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/11f01302-4ecc-40fe-9419-116b8716ce36/ff8888a5304fe38e7e6b798e4eb3a36f95a17bc5_1584615366.png',
          },
          publicUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/1820e8e46801b1dd5d21ddbd825052cd8e2d25e5.jpeg',
          publicThumbnailUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/ddb6310ac1ae612922743b8a572f62a310dccdd8.jpeg',
          publicOverlayUrl:
            'https://d855tsr3ksmom.cloudfront.net/paperplane/2b7c5cbc-5643-4822-94b9-4587096a93f8/99903b5cdd0adb54f946b8de3697e6517b9160a8.png',
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-01T15:06:29+00:00',
          type: 'image',
          comments: 0,
          upVotes: 8,
        },
        {
          id: '7fe2b417-7846-4699-8e68-4eecb6545e3f',
          author: {
            id: '2b7c5cbc-5643-4822-94b9-4587096a93f8',
            name: 'Kasra',
            profilePicture:
              'https://d855tsr3ksmom.cloudfront.net/profile/2b7c5cbc-5643-4822-94b9-4587096a93f8/0ebf7ec0d32e21ccabd3d06f7a814d0c4b5213d4_1596702780.jpeg',
            email: '',
            location: {
              country: 'Germany',
              city: 'Bonn',
            },
            createdAt: '2020-08-06T08:06:19+00:00',
            following: false,
          },
          inspiration: {
            id: 1,
            text: '',
            active: true,
            position: 0,
            icon:
              'https://d855tsr3ksmom.cloudfront.net/inspiration/11f01302-4ecc-40fe-9419-116b8716ce36/ff8888a5304fe38e7e6b798e4eb3a36f95a17bc5_1584615366.png',
          },
          publicUrl: null,
          publicThumbnailUrl: null,
          publicOverlayUrl: null,
          message: null,
          location: {
            city: 'Bonn',
            country: 'Germany',
          },
          fromGallery: false,
          createdAt: '2020-09-01T15:04:49+00:00',
          type: 'image',
          comments: 0,
          upVotes: 7,
        },
      ],
      current_page: 1,
      pages_count: 22,
      total_count: 132,
    },
  };
  const expectedAction = {
    type: 'paperPlanes/set',
    payload: expectedResponse.paper_planes,
  };
  let store;

  beforeEach(() => {
    moxios.install();

    // Create the store with the initial state
    store = storeFactory(initialState);
  });
  afterEach(() => {
    moxios.uninstall();
  });

  test('paperPlanes.set action creator creates the expected action', () => {
    const action = actionCreators.paperPlanes.set(
      expectedResponse.paper_planes,
    );
    expect(action).toEqual(expectedAction);
  });

  test('dispatch paperPlanes/set action correctly updates the store', async done => {
    // Mock the response to /paperPlane/list
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: expectedResponse,
      });
    });

    // Execute the api call to /paperPlane/list
    const res = await axios.get('/paperplane/list');

    const action = actionCreators.paperPlanes.set(res.data.paper_planes);
    store.dispatch(action);

    const newState = store.getState();
    expect(newState.paperPlanes.paperPlanes).toEqual(
      expectedResponse.paper_planes,
    );
    done();
  });
});
