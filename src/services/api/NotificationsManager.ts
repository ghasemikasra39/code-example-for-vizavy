import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import BackendApiClient from './BackendApiClient';
import moment from 'moment';
import { Bugtracker } from '../utility/BugTrackerService';

class NotificationsManager {
  captureError = (error) => {
    Bugtracker.captureException(error, { scope: 'NotificationsManager' });
  };

  /**
   * Return a list of all reaction for a single message
   * @function getReactionsSingleMessage
   * @params {id} - chatroom message id
   */
  loadNotifiations = async (page: number) => {
    const config = {
      method: 'GET',
      url: `/notifications/tmp?page=${page ? page : 1}`,
    };
    return BackendApiClient.requestAuthorized(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log('error: ', error);
        this.captureError(error);
        return error;
      });
  };

  /**
   * Marks specific notifications as seen and reduces the total badge count
   */
  markNotitificationAsSeen = async (id?: number) => {
    const data = new FormData();
    const dateTime = moment().format('YYYY-MM-DD hh:mm:ss');

    data.append('seenAt', dateTime);
    await BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: `/notifications/${id}/update`,
      data,
    })
      .then(() => {
        const action = actionCreators.notifications.decreaseUnseenNotificationCount();
        store.dispatch(action);
      })
      .catch((e) => {
        Bugtracker.captureException(e, { scope: 'NotificationsManager' });
      });
  };

  resetNotificationsCount = async () => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: 'notifications/reset',
    })
      .then((res) => {
        const action = actionCreators.notifications.setUnseenNotificationsCount(
          0,
        );
        store.dispatch(action);
        return res.data;
      })
      .catch((err) => {
        console.log('err: ', err);
        Bugtracker.captureException(err, { scope: 'NotificationsManager' });
        return err;
      });
  };
}

export default new NotificationsManager();
