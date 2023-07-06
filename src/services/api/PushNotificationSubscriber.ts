import BackendApiClient from './BackendApiClient';
import { Platform } from 'react-native';
import NavigationService from '../utility/NavigationService';
import { PaperPlaneInterface } from './PaperPlaneManager';
import MixPanelClient, {
  ENABLE_PUSH_NOTIFICATIONS,
} from '../utility/MixPanelClient';
import messaging from '@react-native-firebase/messaging';
import NotificationsManager from './NotificationsManager';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import ChatRoomManager from './ChatRoomManager';
import ReferralManager from './ReferralManager';

export const NOTIFICATION_TYPE_INCOMING_PAPERPLANE = 0;
export const NOTIFICATION_TYPE_PAPERPLANE_UPVOTE = 1;
export const NOTIFICATION_TYPE_PAPERPLANE_REPLY = 2;
export const NOTIFICATION_TYPE_PAPERPLANE_REPLY_TO_REPLY = 3;
export const TYPE_SOMEONE_FOLLOWED = 4;
export const TYPE_ACCOUNT_BLOCKED = 5;
export const TYPE_ACCOUNT_BLOCKED_FOR_BLACKLISTED_COUNTRY = 6;
export const TYPE_SUBSCRIBED_PAPERPLANE_COMMENTED = 7;
export const TYPE_GREETINGS = 8;
export const TYPE_ADMIN = 9;
export const TYPE_REPLY_UPVOTE = 10;
export const TYPE_CHAT_ROOM_CREATED = 11;
export const TYPE_CHAT_ROOM_MESSAGE_REPLY = 12;
export const TYPE_CHAT_ROOM_NEW_MEMBER = 13;
export const TYPE_CHAT_ROOM_NEW_MESSAGE = 14;
export const TYPE_CHAT_ROOM_MEMBER_BLOCKED = 15;
export const TYPE_NEW_FRIENDSHIP_REQUEST = 16;
export const TYPE_FRIENDSHIP_REQUEST_APPROVED = 17;
export const TYPE_ROOM_ABOUT_TO_EXPIRE = 18;
export const TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED = 19;
export const TYPE_CHAT_ROOM_EXTENSION_ALLOWED = 20;
export const TYPE_CHAT_ROOM_EXTENDED = 21;
export const TYPE_CHAT_ROOM_APPROVED = 22;
export const TYPE_CHAT_ROOM_REJECTED = 23;
export const TYPE_NEW_REFERRAL_INVITE = 24;
export const TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED = 25;
export const TYPE_PAPER_PLANE_REACTION_CREATED = 26;
export const TYPE_DIRECT_CHAT_MESSAGE_CREATED = 27;

export const NOTIFICATIONS_NOT_APPROVED = 'Not_Determined';
export const NOTIFICATIONS_DENIED = 'Denied';
export const NOTIFICATIONS_AUTHORIZED = 'Authorized';

class PushNotificationSubscriber {
  requestUserPermission = async () => {
    const settings = await messaging().requestPermission();
    if (settings) {
      return settings;
    }
  };

  /**
   * Check if user has enabled his notificationsF
   * @function checkNotificationsEnabledStatus
   */
  checkNotificationsEnabledStatus = async () => {
    const enabledStatus = await messaging().hasPermission();
    switch (enabledStatus) {
      case -1:
        return NOTIFICATIONS_NOT_APPROVED;
      case 0:
        return NOTIFICATIONS_DENIED;
      case 1:
        return NOTIFICATIONS_AUTHORIZED;
    }
  };

  /**
   * Increases the badge count by one
   * @method updateBadgeCount
   */
  updateBadgeCount() {
    const action = actionCreators.notifications.increaseBadgeNotificationCount();
    store.dispatch(action);
  }

  /**
   * Reset the badge count
   * @method resetNotificationBadgeCount
   */
  resetNotificationBadgeCount() {
    const action = actionCreators.notifications.setBadgeNotificationCount(0);
    store.dispatch(action);
  }

  /**
   * Set all three types of listener
   * @method setFCMListener
   */
  setFCMListener = () => {
    messaging().onNotificationOpenedApp(this.handleSelected);
    messaging().getInitialNotification().then(this.handleSelected);
    this.setNotificationListener();
  };

  /**
   * Fetch FCM token from firebase and send it to our BE
   * @method fetchFCMToken
   */
  fetchFCMToken = () => {
    messaging()
      .getToken()
      .then(async (token) => {
        const requestConfig = {
          method: 'POST',
          url: '/push-token',
          data: {
            deviceId: token,
          },
        };
        const response = await BackendApiClient.requestAuthorizedAsync(
          requestConfig,
        );

        if (response.status === 200) this.setFCMListener();
      });
  };

  /**
   * Ask user to allow the push notification service, this method is called only once
   * The first time when the user enables the push notifications
   * @method pushNotifPermChecker
   */
  pushNotifPermChecker = async (): Promise<boolean> => {
    const notificationPermission = await this.requestUserPermission();
    if (notificationPermission) {
      MixPanelClient.trackUserInformation({
        [ENABLE_PUSH_NOTIFICATIONS]: true,
      });

      this.fetchFCMToken();

      store.dispatch({
        type: 'appStatus/setPushNotifAllowed',
        payload: true,
      });
      return true;
    } else {
      store.dispatch({
        type: 'appStatus/setPushNotifAllowed',
        payload: false,
      });
      return false;
    }
  };

  /**
   * Fetch FCM token and subscribes for push notification id user allowed
   * This method is called everytime the user opens the app
   * @method registerForPushNotificationsAsync
   */
  registerForPushNotificationsAsync = async () => {
    this.fetchFCMToken();
  };

  /**
   * This method registers Event listeners for receiving background notifications.
   * @method setNotificationListener
   */
  setNotificationListener = () => {
    const state = store.getState();
    if (state.appStatus.pushNotifAllowed && Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener(
        'register',
        this.onRegisteredEventListener,
      );
      PushNotificationIOS.addEventListener(
        'registrationError',
        this.onRegistrationError,
      );
      PushNotificationIOS.addEventListener(
        'notification',
        this.onReceiveRemoteNotification,
      );
      PushNotificationIOS.addEventListener(
        'localNotification',
        this.onReceiveLocalNotification,
      );
    }
  };

  /**
   * Registers the background event listener
   * @method onRegisteredEventListener
   */
  onRegisteredEventListener = (deviceId) => {
    const result = `
    DeviceId:  ${deviceId};\n `;
    MixPanelClient.trackEvent('onRegisteredEventListener', { result });
  };

  /**
   * Gets called when the event registration fails
   * @method onRegistrationError
   */
  onRegistrationError = (error) => {
    const result = `
    Code:  ${error.code};\n
    Message: ${error.message};\n
    Details: ${error.details};\n `;
    MixPanelClient.trackEvent('onRegistrationError', { result });
  };
  /**
   * Listens to local notifications
   * @method onReceiveLocalNotification
   */
  onReceiveLocalNotification = (notification) => {
    this.updateBadgeCount();
    const result = `
    Title:  ${notification.getTitle()};\n
    Message: ${notification.getMessage()};\n
    badge: ${notification.getBadgeCount()};\n
    sound: ${notification.getSound()};\n
    category: ${notification.getCategory()};\n
    content-available: ${notification.getContentAvailable()}.`;
    MixPanelClient.trackEvent('onReceiveLocalNotification', { result });
    notification.finish(PushNotificationIOS.FetchResult);
  };

  /**
   * Listens to remote notifications
   * @method onReceiveLocalNotification
   */
  onReceiveRemoteNotification = (notification) => {
    this.updateBadgeCount();
    const result = `
      Title:  ${notification.getTitle()};\n
      Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()}.`;
    MixPanelClient.trackEvent('onReceiveRemoteNotification', { result });
    notification.finish(PushNotificationIOS.FetchResult);
  };

  /**
   * Executed when the App is in background and opened by tapping on the notification in the status bat
   * @function handleSelected
   * @param {json string} remoteMessage - The notification json object in a string format
   */
  handleSelected = async (remoteMessage) => {
    const notification = JSON.parse(remoteMessage.data.message);
    switch (notification.type) {
      case NOTIFICATION_TYPE_INCOMING_PAPERPLANE:
        NavigationService.navigate('OpenPaperPlane', {
          paperPlane: notification.paperPlane,
        });
        break;
      case NOTIFICATION_TYPE_PAPERPLANE_UPVOTE:
        NavigationService.navigate('PaperPlaneDetailsScreen', {
          item: notification.paperPlane,
          returnRoute: 'PaperPlane',
        });
        break;
      case TYPE_REPLY_UPVOTE:
      case NOTIFICATION_TYPE_PAPERPLANE_REPLY:
      case NOTIFICATION_TYPE_PAPERPLANE_REPLY_TO_REPLY:
        NavigationService.navigate('ReplyScreen', {
          paperPlane: notification.paperPlane,
          userProfile: notification.relatedUser,
          reply: notification.reply,
          returnRoute: 'NewsScreen',
          resetStack: true,
        });
        break;
      case TYPE_SUBSCRIBED_PAPERPLANE_COMMENTED:
        NavigationService.navigate('ReplyScreen', {
          paperPlane: notification.paperPlane,
          returnRoute: 'NewsScreen',
          reply: notification.reply,
          newCommentUUID: notification.comment.id,
        });
        break;
      case TYPE_SOMEONE_FOLLOWED:
        NavigationService.navigate('UsersProfileScreen', {
          payload: {
            paperPlane: { author: { id: notification.relatedUser.id } },
            relatedUser: notification.relatedUser,
          },
        });
        break;
      case TYPE_CHAT_ROOM_CREATED:
      case TYPE_CHAT_ROOM_MESSAGE_REPLY:
      case TYPE_CHAT_ROOM_NEW_MEMBER:
      case TYPE_CHAT_ROOM_NEW_MESSAGE:
      case TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED:
      case TYPE_CHAT_ROOM_EXTENSION_ALLOWED:
      case TYPE_CHAT_ROOM_EXTENDED:
      case TYPE_CHAT_ROOM_APPROVED:
        ChatRoomManager.navigateToChatRoomScreen(notification.chat_room.id);
        break;
      case TYPE_CHAT_ROOM_REJECTED:
        break;
      case TYPE_ACCOUNT_BLOCKED:
        return;
      case TYPE_ACCOUNT_BLOCKED_FOR_BLACKLISTED_COUNTRY:
        break;
      case TYPE_GREETINGS:
        return;
      case TYPE_NEW_FRIENDSHIP_REQUEST:
        NavigationService.navigate('PaperPlane', {
          screen: 'NewsScreen',
        });
        break;
      case TYPE_FRIENDSHIP_REQUEST_APPROVED:
        NavigationService.navigate('PaperPlane', {
          screen: 'NewsScreen',
        });
        break;
      case TYPE_NEW_REFERRAL_INVITE:
        NavigationService.navigate('PaperPlane', {});
        ReferralManager.getReferralInvites();
        break;
      case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
      case TYPE_PAPER_PLANE_REACTION_CREATED:
      case TYPE_DIRECT_CHAT_MESSAGE_CREATED:
        NavigationService.navigate('DirectRoomsScreen', {});
        break;
    }
    NotificationsManager.markNotitificationAsSeen(notification.id);
  };
}

export interface BackendNotificationInterface {
  id: number;
  type: number;
  createdAt: string;
  readableEvent: string;
  relatedUser?: {
    name: string;
    profilePicture: string;
    following: boolean;
    location: {
      city?: string;
      country: string;
    };
  };
  paperPlane?: PaperPlaneInterface;
  friendship_request: {
    id: number;
  };
  reply: Object;
  delivery?: string;
  comment: any;
  chat_room: { id: number };
  chat_room_message: { id: number };
  chat_room_member: object;
  seenAt?: any;
}

export default new PushNotificationSubscriber();
