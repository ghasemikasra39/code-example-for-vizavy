import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BackendNotificationInterface,
  TYPE_FRIENDSHIP_REQUEST,
} from '../../services/api/PushNotificationSubscriber';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export interface StoredNotificationInterface {
  id: number;
  payload: BackendNotificationInterface | null;
  seen: boolean;
  addedOn: string;
}

export interface PaginatedNotificationsInterface {
  data: BackendNotificationInterface[];
  current_page: number;
  pages_count: number;
  total_count: number;
  unseen_count: number;
}

interface NotificationsSliceState {
  notifications: PaginatedNotificationsInterface;
  friendRequests: Array<Object>;
  latestKnown: number;
  earliestKnown: number;
  unreadNotificationsCount: number;
  seenNotification: number;
  refreshNotification: boolean;
  badgeCount: number;
}

export default createSlice({
  name: 'notifications',
  initialState: {
    notifications: {
      data: [],
      current_page: 0,
      pages_count: 2,
      total_count: 0,
      unseen_count: 0,
    },
    badgeCount: 0,
    friendRequests: [],
    latestKnown: null,
    earliestKnown: null,
    unreadNotificationsCount: 0,
    refreshNotification: false,
  },
  reducers: {
    setNotifications: (state: NotificationsSliceState, action) => {
      try {
        state.notifications = action.payload;
      } catch (error) {
        console.log('error setNotifications: ', error);
      }
    },
    appendNotifications: (state: NotificationsSliceState, action) => {
      try {
        const {
          data,
          current_page,
          pages_count,
          total_count,
          unseen_count,
        } = action.payload;
        state.notifications.data = [...state.notifications.data, ...data];
        state.notifications.current_page = current_page;
        state.notifications.pages_count = pages_count;
        state.notifications.total_count = total_count;
        state.notifications.unseen_count = unseen_count;
      } catch (error) {
        console.log('error appendNotifications: ', error);
      }
    },
    addNewNotification: (state: NotificationsSliceState, action) => {
      try {
        const { unseen_count } = state.notifications;
        const { newMessage, navigation } = action.payload;
        const currentRouteName = navigation.currentRoute.name;
        let newCount = unseen_count + 1;
        const newNotificationsList = [...state.notifications.data];
        newNotificationsList.unshift(newMessage);
        if (currentRouteName !== 'NewsScreen') {
          state.notifications.data = newNotificationsList;
          state.notifications.unseen_count = newCount;
        }
      } catch (error) {
        console.log('error addNewNotification: ', error);
      }
    },
    setUnseenNotificationsCount: (
      state: NotificationsSliceState,
      action: PayloadAction<number>,
    ) => {
      try {
        let newCount = action.payload;
        state.notifications.unseen_count = newCount;
      } catch (error) {
        console.log('error setUnseenNotificationsCount: ', error);
      }
    },
    increaseUnseenNotificationCount: (state: NotificationsSliceState) => {
      try {
        const { unseen_count } = state.notifications;
        let newCount = unseen_count + 1;
        state.notifications.unseen_count = newCount;
        PushNotificationIOS.setApplicationIconBadgeNumber(newCount);
      } catch (error) {
        console.log('error increaseUnseenNotificationCount: ', error);
      }
    },
    decreaseUnseenNotificationCount: (state: NotificationsSliceState) => {
      try {
        const { unseen_count } = state.notifications;
        let newCount = unseen_count - 1;
        if (newCount < 0) return;
        state.notifications.unseen_count = newCount;
      } catch (error) {
        console.log('error addNewNotification: ', error);
      }
    },
    addNewFriendshipRequest: (state: NotificationsSliceState, action) => {
      try {
        const newRequest = action.payload;
        const newFriendshipRequestList = [...state.friendRequests];
        newFriendshipRequestList.unshift(newRequest);
        state.friendRequests = newFriendshipRequestList;
      } catch (error) {
        console.log('error addNewFriendshipRequest: ', error);
      }
    },
    increaseBadgeNotificationCount: (state: NotificationsSliceState) => {
      try {
        const { badgeCount } = state;
        let newCount = badgeCount + 1;
        state.badgeCount = newCount;
        PushNotificationIOS.setApplicationIconBadgeNumber(newCount);
      } catch (error) {
        console.log('error increaseUnseenNotificationCount: ', error);
      }
    },
    setBadgeNotificationCount: (state: NotificationsSliceState, action) => {
      try {
        const newCount = action.payload;
        state.badgeCount = newCount;
        PushNotificationIOS.setApplicationIconBadgeNumber(newCount);
      } catch (error) {
        console.log('error increaseUnseenNotificationCount: ', error);
      }
    },
    removeNotification: (
      state: NotificationsSliceState,
      action: PayloadAction<number>,
    ) => {
      if (state.notifications[action.payload]) {
        delete state.notifications[action.payload];
        const remainingNotificationIds = Object.values(state.notifications).map(
          (n) => n.id,
        );
        state.earliestKnown = Math.min(...remainingNotificationIds);
        state.latestKnown = Math.max(...remainingNotificationIds);
      }
    },
    refreshNotifications: (state: NotificationsSliceState, action) => {
      state.refreshNotification = action.payload;
    },
    setFriendshipRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    deleteFriendshipReject: (state, action) => {
      const requestId = action.payload;
      const { friendRequests, notifications } = state;
      function deleteRequestFromRequestsList() {
        const friendshipRequestIndex = friendRequests.findIndex(
          (request) => request?.id === requestId,
        );
        state.friendRequests.splice(friendshipRequestIndex, 1);
      }
      function deleteRequestFromNotifications() {
        const notificationFriendshipIndex = notifications.data.findIndex(
          (request) => request?.friendship_request?.id === requestId,
        );
        state.notifications.data.splice(notificationFriendshipIndex, 1);
      }
      try {
        deleteRequestFromRequestsList();
        deleteRequestFromNotifications();
      } catch (error) {
        console.log('error deleteFriendshipReject: ', error);
      }
    },
  },
});

export const notificationsProps = (state) => ({
  notifications: state.notifications,
  latestKnown: state.latestKnown,
  earliestKnown: state.earliestKnown,
  unreadNotificationsCount: state.unreadNotificationsCount,
  refreshNotification: state.refreshNotification,
});

export interface NotificationsStatePropsInterface {
  notifications: NotificationsSliceState;
}

export interface NotificationsActionsPropsInterface {
  setNotifications: (notifications) => void;
  addNotifications: (notifications: BackendNotificationInterface[]) => void;
  markAsSeen: (notificationId: number) => void;
  setUnreadNotificationsCount: (count: number) => void;
  increaseUnreadNotificationsCount: () => void;
  refreshNotifications: () => void;
}

export interface NotificationsPropsInterface
  extends NotificationsStatePropsInterface,
  NotificationsActionsPropsInterface { }
