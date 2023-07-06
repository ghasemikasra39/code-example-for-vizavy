import { store } from '../../store';
// import { Notifications } from 'expo';
import { Platform } from 'react-native';
import Globals from '../../component-library/Globals';
import BackendApiClient from '../api/BackendApiClient';

class UnreadNotificationsCountWatcher {
  update = async () => {
    const response = await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/notifications',
    });
    const unreadNotificationsCount = response.data.total_unSeen;
    store.dispatch({
      type: 'notifications/setUnreadNotificationsCount',
      payload: Number(unreadNotificationsCount),
    });
  };
}

export default new UnreadNotificationsCountWatcher();
