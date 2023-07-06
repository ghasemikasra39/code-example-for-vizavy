import { store } from '../../store';
import BackendApiClient from '../api/BackendApiClient';
import ChatRoomManager from '../api/ChatRoomManager';
import publicPusherBinder from '../Pusher/PublicPusherListeners';
import userFeedPusherBinder from '../Pusher/UserFeedPusherListeners';
import NotificationsManager from '../api/NotificationsManager';
import { actionCreators } from '../../store/actions';
import { getDateFromPrviousWeeks } from '../../screens/ChatRoom/ChatroomUtils';
import UserProfileManager from '../api/UserProfileManager';
import FriendshipManager from '../api/FriendshipManager';
import PaperPlaneManager from '../api/PaperPlaneManager';

export enum RequestsEnum {
  PROMPTS = 'prompts',
  PAPER_PLANES = 'paper_planes',
  INSPIRATIONS = 'inspirations',
  PROFILE = 'profile',
  CURENT_ROOMS = 'current_rooms',
  EXPIRED_ROOMS = 'expired_rooms',
  NOTIFICATIONS = 'notifications',
  FRIENDSHIP_REQUESTS = 'friendship_requests',
  ANNOUNCEMENTS = 'announcements',
  REFERRAL_INVITES = 'referral_invites',
  DIRECT_CHATS = 'direct_chats',
}

class InitialLoadingService {

  /**
   * Fetch all the rooms Data
   * @method fetchRooms
   */
  fetchRooms = async () => {
    ChatRoomManager.getRoomsListAsync();
    const startDate = getDateFromPrviousWeeks(7);
    ChatRoomManager.getRoomsListAsync(startDate);
  };


  /**
   * Update prompts on EditProfileModal
   * @method updatePrompts
   * @param {propmts - array} - array of prompts
   */
  updatePrompts = (prompts: Array<Object>) => {
    const action = actionCreators.userProfile.setPrompts(prompts);
    store.dispatch(action);
  };

  /**
   * Load first 20 paper planes of my profile
   * @method updateMyPaperPlanes
   * @param {paperPlanes - array} - array of my paper planes
   */
  updateMyPaperPlanes = (paperPlanes: Array<Object>) => {
    const action = actionCreators.myProfile.setPaperPlanes(paperPlanes);
    store.dispatch(action);
  };

  /**
   * Load all inspiration on CameraScreen
   * @method updateInspirations
   * @param {inspirations - array} - array of inspirations
   */
  updateInspirations = (inspirations: Array<Object>) => {
    const action = actionCreators.inspirations.setInspirations(inspirations);
    store.dispatch(action);
  };

  /**
   * Load all userProfile information
   * @method updateMyProfile
   * @param {myProfileData - Object} - User profile data
   */
  updateMyProfile = (myProfileData: Object) => {
    const action = actionCreators.userProfile.setUserProfileDetails(
      myProfileData,
    );
    store.dispatch(action);
    UserProfileManager.updateUserProfilePicture(myProfileData?.profilePicture);
  };

  /**
   * Load all active rooms
   * @method updateActiveRooms
   * @param {currentRooms - Array} - Array of active roms
   */
  updateActiveRooms = (currentRooms: Array<Object>) => {
    const action = actionCreators.chatRoom.setRooms(currentRooms);
    store.dispatch(action);
  };

  /**
   * Load all inactive rooms
   * @method updateExpiredRooms
   * @param {expiredRooms - Array} - Array of inactive roms
   */
  updateExpiredRooms = (expiredRooms: Array<Object>) => {
    const action = actionCreators.chatRoom.setInActiveRooms(expiredRooms);
    store.dispatch(action);
  };

  /**
   * Load new friendship requests
   * @method updateFriendshipRequests
   * @param {friendRequests - Array} - Array of friendship requests
   */
  updateFriendshipRequests = (friendRequests: Array<Object>) => {
    const action = actionCreators.notifications.setFriendshipRequests(
      friendRequests,
    );
    store.dispatch(action);
  };

  /**
   * Load last 15 notifications
   * @method updateNotifications
   * @param {notifications - Array} - Array of last 15 notifications
   */
  updateNotifications = (notifications: Object) => {
    const action = actionCreators.notifications.setNotifications(notifications);
    store.dispatch(action);
  };

  /**
   * Load new feature announcements
   * @method updateAnnouncements
   * @param {announcements - Array} - Array of new feature announcements
   */
  updateAnnouncements = (announcements: Array<Object>) => {
    if (announcements?.length === 0) return;
    const seen = actionCreators.appStatus.setNewFeatureList(announcements);
    store.dispatch(seen);
  };

  /**
   * Update Referral list in redux
   * @method updateReferrals
   * @param {referrals - Array} - Array of referrals
   */
  updateReferrals = (referrals: Array<Object>) => {
    this.showInviteFriendsPopUpBox(referrals);
    const action = actionCreators.referrals.setReferrals(referrals);
    store.dispatch(action);
  };

  /**
   * Inser all direct chats into redux
   * @method updateDirectChats
   * @param {directChats - Array} - Array of direct chat objects
   */
  updateDirectChats = (directChats: Array<Object>) => {
    const action = actionCreators.directChat.setDirectChatsList(directChats);
    store.dispatch(action);
  };

  /**
   * Bind to public and private pusher
   * @method bindToPusher
   */
  bindToPusher = () => {
    publicPusherBinder();
    userFeedPusherBinder();
  };

  /**
   * Show bottom when receiving codepush event
   * @method showBottomBar
   */
  showBottomBar = () => {
    const action = actionCreators.bottomTabBar.setVisibility(true);
    store.dispatch(action);
  };

  /**
   * Mark all loading indicators that are controlled by redux as false so that we never have infinit loading indicators
   * @method resetAllReduxLoadingIndicators
   */
  resetAllReduxLoadingIndicators = () => {
    ChatRoomManager.showLoadingRooms(false);
    FriendshipManager.showRefreshLoadingIndicator(false);
    this.showInitialLoadingIndicator(false);
  };

  /**
   * Toggle InviteFriendPopUp to show the user that he has a new invite
   * @method showInviteFriendsPopUpBox
   * @param {referrals - Array} - Array of referrals
   */
  showInviteFriendsPopUpBox = (referrals) => {
    const state = store.getState();
    const previousReferrals = state.referrals?.referral_invites;
    const lastPreviousReferral =
      previousReferrals[previousReferrals?.length - 1];
    const lastCurrentReferral = referrals[referrals?.length - 1];
    if (lastPreviousReferral?.id !== lastCurrentReferral?.id) {
      const inviteAction = actionCreators.appStatus.setInviteFriendPopUpSeen(
        false,
      );
      store.dispatch(inviteAction);
    }
  };

  /**
   * Show initial loading indicator on rooms screen and direct rooms screen
   * @method showInitialLoadingIndicator
   * @param {show} - weather to show the indicator or not
   */
  showInitialLoadingIndicator = (show: boolean) => {
    const action = actionCreators.appStatus.setShowInitialLoadingIndicator(
      show,
    );
    store.dispatch(action);
  };

  /**
   * Clear paper plane redux list
   * @method resetPaperPlanes
   * @param {paperPlanes} - Array of two paper planes
   */
  resetPaperPlanes = () => {
    const action = actionCreators.paperPlanes.set();
    store.dispatch(action);
  };

  /**
   * Clear paper plane redux list
   * @method requestInitialPaperPlanes
   * @param {count} - count of paper planes to request
   */
  requestInitialPaperPlanes = () => {
    this.resetPaperPlanes();
    const state = store.getState();
    const { paperPlanes } = state;
    const paperPlaneLength = paperPlanes.paperPlanes?.length;
    if (paperPlaneLength < 10) {
      PaperPlaneManager.requestPaperPlanesAsync();
    }
  };

  compileQuery = (requests: Array<RequestsEnum>) => {
    let queryString = '/initial-data?';
    const requestsLength = requests?.length;
    requests.forEach((request, index) => {
      if (index === requestsLength - 1) {
        queryString = `${queryString}includes[]=${request}`;
      } else {
        queryString = `${queryString}includes[]=${request}&`;
      }
    });
    return queryString;
  };

  /**
   * Load all data at once
   * @method loadAllData
   */
  loadAllData = (requests?: Array<RequestsEnum>) => {
    let query = requests !== undefined ? this.compileQuery(requests) : null;
    const url = requests ? query : '/initial-data';
    if (!requests) {
      this.requestInitialPaperPlanes();
    }
    this.showInitialLoadingIndicator(true);
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: url,
    })
      .then((response) => {
        const {
          success,
          prompts,
          paper_planes,
          inspirations,
          profile,
          current_rooms,
          expired_rooms,
          friendship_requests,
          announcements,
          referral_invites,
          direct_chats,
          notifications,
        } = response.data;
        if (!success) return;
        console.log('response.data: ', response.data);
        if (prompts !== undefined) {
          this.updatePrompts(prompts);
        }
        if (paper_planes !== undefined) {
          this.updateMyPaperPlanes(paper_planes);
        }
        if (inspirations !== undefined) {
          this.updateInspirations(inspirations);
        }
        if (profile !== undefined) {
          this.updateMyProfile(profile);
        }
        if (current_rooms !== undefined) {
          this.updateActiveRooms(current_rooms);
        }
        if (expired_rooms !== undefined) {
          this.updateExpiredRooms(expired_rooms);
        }
        if (friendship_requests !== undefined) {
          this.updateFriendshipRequests(friendship_requests);
        }
        if (announcements !== undefined) {
          this.updateAnnouncements(announcements);
        }
        if (referral_invites !== undefined) {
          this.updateReferrals(referral_invites);
        }
        if (notifications !== undefined) {
          this.updateNotifications(notifications);
        }
        if (direct_chats !== undefined) {
          this.updateDirectChats(direct_chats);
        }
        this.showBottomBar();
        if (!requests) {
          this.bindToPusher();
        }
        this.resetAllReduxLoadingIndicators();
      })
      .catch((error) => {
        this.resetAllReduxLoadingIndicators();
      });
  };
}

export default new InitialLoadingService();
