import {combineReducers} from 'redux';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {createEpicMiddleware} from 'redux-observable';
import {rootEpic} from './Epics/index';
import AsyncStorage from '@react-native-community/async-storage';
import * as ReduxPersistActions from 'redux-persist/lib/constants';
import AppStatusSlice from './slices/AppStatusSlice';
import InspirationsSlice from './slices/InspirationsSlice';
import NotificationsSlice from './slices/NotificationsSlice';
import UserProfileSlice from './slices/UserProfileSlice';
import PaperPlaneSlice from './slices/PaperPlaneSlice';
import RepliesSlice from './slices/RepliesSlice';
import AppMetricsSlice from './slices/AppMetricsSlice';
import OnScreenDirectionSlice from './slices/OnScreenDirectionSlice';
import NotificationPopupSlice from './slices/NotificationPopupSlice';
import NetInfo from './slices/NetInfoSlice';
import BottomTabBarSlice from './slices/BottomTabBarSlice';
import popupSlice from './slices/PopupSlice';
import MyProfileSlice from './slices/MyProfileSlice';
import ChatRoomSlice from './slices/ChatRoomsSlice';
import NavigationSlice from './slices/NavigationSlice';
import ReferralSlice from './slices/ReferralSlice';
import DirectChatSlice from './slices/DirectChatSlice';
import {Bugtracker} from "../services/utility/BugTrackerService";

function isTestingEnv() {
  return process.env.JEST_WORKER_ID !== undefined;
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export const reducersCombined = combineReducers({
  appStatus: AppStatusSlice.reducer,
  userProfile: UserProfileSlice.reducer,
  inspirations: InspirationsSlice.reducer,
  paperPlanes: PaperPlaneSlice.reducer,
  replies: RepliesSlice.reducer,
  notifications: NotificationsSlice.reducer,
  appMetrics: AppMetricsSlice.reducer,
  onScreenDirection: OnScreenDirectionSlice.reducer,
  notificationPopup: NotificationPopupSlice.reducer,
  bottomTabBar: BottomTabBarSlice.reducer,
  popup: popupSlice.reducer,
  myProfile: MyProfileSlice.reducer,
  netInfo: NetInfo.reducer,
  chatRoom: ChatRoomSlice.reducer,
  navigation: NavigationSlice.reducer,
  referrals: ReferralSlice.reducer,
  directChat: DirectChatSlice.reducer,
});

const reducerPersisted = persistReducer(persistConfig, reducersCombined);

const rootReducer = (state, actions) => {
  if (actions.type === 'RESET_STORE') {
    state = undefined;
  }
  return reducerPersisted(state, actions);
};

const epicMiddleware = createEpicMiddleware();
export const defaultMiddleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [
      ReduxPersistActions.FLUSH,
      ReduxPersistActions.REHYDRATE,
      ReduxPersistActions.PAUSE,
      ReduxPersistActions.PERSIST,
      ReduxPersistActions.PURGE,
      ReduxPersistActions.REGISTER,
    ],
  },
});

let sentryReduxEnhancer;
const isTesting = isTestingEnv();

if (!isTesting) sentryReduxEnhancer = Bugtracker.Sentry.createReduxEnhancer();

function configure() {
  let store = configureStore({
    reducer: rootReducer,
    middleware: [...defaultMiddleware, epicMiddleware],
    enhancers: !isTesting ? [sentryReduxEnhancer] : []
  });

  epicMiddleware.run(rootEpic);

  return store;
}

export const store = configure();
export const persistor = persistStore(store);

if (__DEV__) window.purgeStorage = () => persistor.purge();
