import BackendApiClient from './BackendApiClient';
import { Bugtracker } from '../utility/BugTrackerService';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';

export interface SentReferralsInvitesInterface {
  sent_at: string;
  phone_number: string;
}

class ReferralManager {
  /**
   * Get list of referral links
   * @function getReferralInvites
   */
  getReferralInvites = async () => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/referral-invites`,
    })
      .then((response) => {
        const { referral_invites } = response.data;
        const action = actionCreators.referrals.setReferrals(referral_invites);
        store.dispatch(action);
        return response.data;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'ReferralManager' });
        return error;
      });
  };

  /**
   * After sending the referral link to a contact, let BE know that we have used the invite link
   * @function sendReferralInvite
   */
  sendReferralInvite = async (
    id: string,
    body: SentReferralsInvitesInterface,
  ) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'PUT',
      url: `/referral-invites/${id}`,
      data: body,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log('error: ', error);
        Bugtracker.captureException(error, { scope: 'ReferralManager' });
        return error;
      });
  };

  /**
   * Get status of people who have already joined the application
   * @function getReferralInviteStatuses
   */
  getReferralInviteStatuses = async (phoneNumbers: Array<string>) => {
    const data = {
      phone_numbers: phoneNumbers,
    }
    return BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: '/referral-invites-statuses',
      data,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        Bugtracker.captureException(error, { scope: 'SearchManager' });
        return error;
      });
  };
}

export default new ReferralManager();
