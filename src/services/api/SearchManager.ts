import BackendApiClient from './BackendApiClient';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import { Bugtracker } from '../utility/BugTrackerService';

class SearchManager {
  /**
   * Get list of mutual friends and suggested people
   * @function getSuggestedFriendsList
   */
  getSuggestedFriendsList = async (page: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/user-search?page=${page}`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'SearchManager' });
        return error;
      });
  };

  /**
   * Get list of people you searched for
   * @function getSearchResults
   */
  getSearchResults = async (textInput: string, configuration) => {
    return BackendApiClient.requestAuthorizedAsync(configuration)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'SearchManager' });
        return error;
      });
  };

}

export default new SearchManager();
