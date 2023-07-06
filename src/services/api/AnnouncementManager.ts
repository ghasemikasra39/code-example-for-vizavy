import BackendApiClient from './BackendApiClient';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import { Bugtracker } from '../utility/BugTrackerService';

class AnnouncementManager {
  /**
   * Get list of new features that havet been seen
   * @function getNewAnnouncements
   */
  getNewAnnouncements = async () => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/new-announcements`,
    })
      .then((response) => {
        if (response.data.success) {
          this.setNewAnnouncementListRedux(response.data.announcements);
        }
        return response.data;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'AnnouncementManager' });
        return error;
      });
  };

  /**
   * Mark a feature as seen in redux
   * @function markAnnouncementSeen
   */
  markAnnouncementSeen = () => {
    const seen = actionCreators.appStatus.markNewFeatureListSeen();
    store.dispatch(seen);
  };

  /**
   * Set new feature list in redux
   * @function setNewAnnouncementListRedux
   * @param {announcements} - list of new announcements
   */
  setNewAnnouncementListRedux = (announcements: Array<Object>) => {
    if (announcements?.length === 0) return;
    const seen = actionCreators.appStatus.setNewFeatureList(announcements);
    store.dispatch(seen);
  };

}

export default new AnnouncementManager();
