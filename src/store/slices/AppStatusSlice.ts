import { createSlice } from '@reduxjs/toolkit';
import { activeItemToolBar } from '../../component-library/Editor/InterfaceProperties';

export interface NewFeatureList {
  id: number;
  image: string;
  title: string;
  description: string;
  createdAt: string;
}

interface AppStatusState {
  markTapToShare: boolean;
  markFirstRoom: boolean;
  pushNotifAllowed: boolean;
  askedForNotificationPermissions: boolean;
  audioAllowed: boolean;
  dynamicLink?: number;
  welcomeRoomVisited: boolean;
  onboardingSwipeUpSeen: boolean;
  onboardingRoomsSeen: boolean;
  onboardingRoomsThisWeekSeen: boolean;
  signUpInProgess: boolean;
  newUnseenFeatureList: Array<NewFeatureList>;
  inviteFriendPopUpSeen: boolean;
  appState: object;
  //tracks if user has allowed the location permission
  // after showing the modal, it will be set to true, even if the user does not allowed it
  locationAllowed: boolean;
  installedNewUpdate: boolean;
  showInitialLoadingIndicator: boolean;
}

export default createSlice({
  name: 'appStatus',
  initialState: {
    markTapToShare: false,
    markFirstRoom: false,
    pushNotifAllowed: false,
    askedForNotificationPermissions: false,
    audioAllowed: false,
    locationAllowed: true,
    welcomeRoomVisited: false,
    onboardingRoomsSeen: false,
    onboardingRoomsThisWeekSeen: false,
    onboardingSwipeUpSeen: false,
    signUpInProgess: false,
    newUnseenFeatureList: [],
    inviteFriendPopUpSeen: false,
    appState: {
      prev: 'inactive',
      current: 'active',
    },
    installedNewUpdate: false,
    showInitialLoadingIndicator: false,
  },
  reducers: {
    markTapToShare: (state: AppStatusState, action) => {
      state.markTapToShare = action.payload;
    },
    markFirstRoom: (state: AppStatusState, action) => {
      state.markFirstRoom = action.payload;
    },
    setPushNotifAllowed: (state: AppStatusState, action) => {
      state.pushNotifAllowed = action.payload;
    },
    setAskedForNotificationPermissions: (state: AppStatusState, action) => {
      state.askedForNotificationPermissions = action.payload;
    },
    setAudioAllowed: (state: AppStatusState, action) => {
      state.audioAllowed = action.payload;
    },
    setLocationAllowed: (state: AppStatusState, action) => {
      state.locationAllowed = action.payload;
    },
    setdynamicLink: (state: AppStatusState, action) => {
      state.dynamicLink = action.payload;
    },
    markWelcomeRoomVisited: (state: AppStatusState, action) => {
      state.welcomeRoomVisited = action.payload;
    },
    markOnboardingRoomsSeen: (state: AppStatusState, action) => {
      state.onboardingRoomsSeen = action.payload;
    },
    markOnboardingRoomsThisWeekSeen: (state: AppStatusState, action) => {
      state.onboardingRoomsThisWeekSeen = action.payload;
    },
    markOnboardingSwipeUpSeen: (state: AppStatusState, action) => {
      state.onboardingSwipeUpSeen = action.payload;
    },
    markSignUpInProgress: (state: AppStatusState, action) => {
      state.signUpInProgess = action.payload;
    },
    setNewFeatureList: (state: AppStatusState, action) => {
      state.newUnseenFeatureList = action.payload;
    },
    markNewFeatureListSeen: (state: AppStatusState) => {
      state.newUnseenFeatureList = [];
    },
    setInviteFriendPopUpSeen: (state: AppStatusState, action) => {
      state.inviteFriendPopUpSeen = action.payload;
    },
    setAppState: (state, action) => {
      try {
        state.appState.prev = state.appState.current;
        state.appState.current = action.payload;
      } catch (error) {
        console.log('error setAppState :', error);
      }
    },
    resetAppState: (state, payload) => {
      try {
        state.appState.prev = 'closed';
        state.appState.current = 'active';
      } catch (error) {
        console.log('error resetAppState :', error);
      }
    },
    setInstalledNewUpdate: (state: AppStatusState, action) => {
      state.installedNewUpdate = action.payload;
    },
    setShowInitialLoadingIndicator: (state: AppStatusState, action) => {
      state.showInitialLoadingIndicator = action.payload;
    },
  },
});

export const appStatusProps = (state) => ({
  appStatus: {
    markTapToShare: state.appStatus.markTapToShare,
    markFirstRoom: state.appStatus.markFirstRoom,
    pushNotifAllowed: state.appStatus.pushNotifAllowed,
    askedForNotificationPermissions:
      state.appStatus.setAskedForNotificationPermissions,
    audioAllowed: state.appStatus.audioAllowed,
    locationAllowed: state.appStatus.locationAllowed,
    dynamicLink: state.appStatus.dynamicLink,
    welcomeRoomVisited: state.appStatus.welcomeRoomVisited,
    onboardingRoomsSeen: state.appStatus.onboardingRoomsSeen,
    onboardingSwipeUpSeen: state.appStatus.onboardingSwipeUpSeen,
    onboardingRoomsThisWeekSeen: state.appStatus.onboardingRoomsThisWeekSeen,
    signUpInProgess: state.appStatus.signUpInProgess,
    newUnseenFeatureList: state.appStatus.newUnseenFeatureList,
    inviteFriendPopUpSeen: state.appStatus.inviteFriendPopUpSeen,
    appState: state.appStatus.appState,
    installedNewUpdate: state.appState.installedNewUpdate,
    showInitialLoadingIndicator: state.appState.showInitialLoadingIndicator,
  },
});

export interface AppStatusStatePropsInterface {
  appStatus: AppStatusState;
}

export interface AppStatusActionsPropsInterface {
  markTapToShare: () => void;
  markFirstRoom: () => void;
  setPushNotifAllowed: () => void;
  setAudioAllowed: () => void;
  setLocationAllowed: () => void;
  setdynamicLink: () => void;
  markWelcomeRoomVisited: () => void;
  markOnboardingRoomsSeen: () => void;
  markOnboardingRoomsThisWeekSeen: () => void;
  markOnboardingSwipeUpSeen: () => void;
  markSignUpInProgress: () => void;
  setNewFeatureList: () => void;
  markNewFeatureListSeen: () => void;
  setAppState: () => void;
  resetAppState: () => void;
  setInstalledNewUpdate: () => void;
  setInviteFriendPopUpSeen: () => void;
  setShowInitialLoadingIndicator: () => void;
}

export interface AppStatusPropsInterface
  extends AppStatusStatePropsInterface,
  AppStatusActionsPropsInterface { }
