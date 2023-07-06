import BackendApiClient from './BackendApiClient';
import DevLogger from '../utility/DevLogger';
import FormData from 'react-native/Libraries/Network/FormData';
import { Bugtracker } from '../utility/BugTrackerService';

class UpVoteManager {
  castVoteAsync = async (uuid: string, vote: boolean) => {
    const data = new FormData();
    data.append('uuid', uuid);
    data.append('vote', vote ? 1 : 0);

    try {
      const response = await BackendApiClient.requestAuthorizedAsync({
        method: 'POST',
        url: '/upvote/cast',
        data,
      });

      DevLogger.log(response.data);

      if (!response || response.status !== 200 || !response.data.success) {
        return null;
      }
      return response.data.success;
    } catch (error) {
      Bugtracker.Sentry.captureException(error);
      return null;
    }
  };

  fetchForPaperplaneAsync = async (uuid: string) => {
    try {
      const response = await BackendApiClient.requestAuthorizedAsync({
        method: 'GET',
        url: `/upvote/${uuid}/fetch`,
      });

      DevLogger.log(response.data);

      if (!response || response.status !== 200 || !response.data.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      Bugtracker.Sentry.captureException(error);
      return null;
    }
  };

  upvoteReplyAsync = async (uuid: string) => {
    try {
      const response = await BackendApiClient.requestAuthorizedAsync({
        method: 'POST',
        url: `/paperplane-comments/${uuid}/upvote`,
      });

      DevLogger.log(response.data);

      if (!response || response.status !== 200 || !response.data.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      Bugtracker.Sentry.captureException(error);
      return null;
    }
  };

  fethForReplyVotedStatusAsyc = async (uuid: string) => {
    try {
      const response = await BackendApiClient.requestAuthorizedAsync({
        method: 'GET',
        url: `/paperplane-comments/${uuid}/upvoted`,
      });

      DevLogger.log(response.data);

      if (!response || response.status !== 200 || !response.data.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      Bugtracker.Sentry.captureException(error);
      return null;
    }
  };
}

export default new UpVoteManager();
