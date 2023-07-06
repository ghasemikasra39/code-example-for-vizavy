import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import BackendApiClient from './BackendApiClient';
//import { Bugtracker } from '../utility/BugTrackerService';
import { Alert } from 'react-native';
import { Bugtracker } from '../utility/BugTrackerService';
class FriendshipManager {
  dispatcher = (action) => {
    store.dispatch(action);
  };

  captureError = (error) => {
    Bugtracker.captureException(error, { scope: 'FriendshipManager' });
  };

  /**
   * Send a request to another user to become friends
   * @method sendFriendshipRequest
   * @param {id: number} - user id
   */
  sendFriendshipRequest = async (id: number) => {
    const data = {
      user_id: id,
    };
    return BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: '/friendship-requests',
      data,
    })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        //Dont show alert when user is sending request to himself
        if (error.response.status === 403) return;
        Alert.alert(
          '😕',
          'Failed to send friend request. Please try again later.',
          [{ text: 'OK' }],
        );
        this.captureError(error);
      });
  };

  /**
   * Return a list of all your pending friendship requests
   * @method getFriendshipRequests
   */
  acceptFriendshipRequests = async (requestId: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: `/friendships/${requestId}`,
    })
      .then((res) => {
        this.deleteFriendshipRequestFromRedux(requestId);
        this.getFriendsList();
        return res.data;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'FriendshipManager' });
        Alert.alert(
          '😕',
          'Failed to accept friend request. Please try again later.',
          [{ text: 'OK' }],
        );
        this.captureError(error);
        return error;
      });
  };

  /**
   * Send a request to another user to become friends
   * @method removeFriendship
   */
  rejectFriendship = async (requestId: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'DELETE',
      url: `/friendships/${requestId}`,
    })
      .then((res) => {
        this.deleteFriendshipRequestFromRedux(requestId);
        this.deleteFriendshipFromRedux(requestId);
        return res.data;
      })
      .catch((err) => {
        Alert.alert(
          '😕',
          'Failed to reject friend request. Please try again later.',
          [{ text: 'OK' }],
        );
        this.captureError(err);
        return err;
      });
  };

  /**
   * Return a list of all your pending friendship requests
   * @method getFriendshipRequests
   */
  getFriendshipRequestList = async () => {
    const { dispatcher, captureError } = this;
    this.showRefreshLoadingIndicator(true);
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/friendship-requests',
    })
      .then((res) => {
        const action = actionCreators.notifications.setFriendshipRequests(
          res.data.friendship_requests,
        );
        dispatcher(action);
        this.showRefreshLoadingIndicator(false);
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'FriendshipManager' });
        this.showRefreshLoadingIndicator(false);
      });
  };

  /**
   * Return a list of all your friends
   * @method getFriends
   */
  getFriendsList = async () => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/friendships',
    })
      .then((res) => {
        this.updateFriendships(res.data.friendships);
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'FriendshipManager' });
      });
  };

  /**
   * Delet friendship request or actual friendship from redux list
   * @method deleteFriendshipRequestFromRedux
   */
  deleteFriendshipRequestFromRedux = (requestId: number) => {
    const action = actionCreators.notifications.deleteFriendshipReject(
      requestId,
    );
    this.dispatcher(action);
  };

  deleteFriendshipFromRedux = (id: number, type?: string) => {
    const deleteFriendship = actionCreators.userProfile.deleteFriendship({
      id,
      type,
    });
    this.dispatcher(deleteFriendship);
  };

  showRefreshLoadingIndicator = (refresh: boolean) => {
    const action = actionCreators.notifications.refreshNotifications(refresh);
    this.dispatcher(action);
  };

  updateFriendships = (payload) => {
    const action = actionCreators.userProfile.updateFriendships(payload);
    this.dispatcher(action);
  };

  // captureError = (error) => {
  //   Bugtracker.captureException(error, { scope: 'NotificationsManager' });
  // };
}

export default new FriendshipManager();
