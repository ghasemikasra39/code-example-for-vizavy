import BackendApiClient from './BackendApiClient';
import FormData from 'react-native/Libraries/Network/FormData';
import { store } from '../../store';
import RNFS from 'react-native-fs';
import { actionCreators } from '../../store/actions';
import { Bugtracker } from '../utility/BugTrackerService';
import RNFetchBlob from 'rn-fetch-blob';
import ChatRoomManager from './ChatRoomManager';
import { Alert } from 'react-native';

interface updateProfileParams {
  name: string;
  profilePictureUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  bio_text?: string;
  prompts?: any;
  invited_by_user?: Object;
}

class UserProfileManager {
  async fetchProfileAsync() {
    const loadingStarted = actionCreators.userProfile.setLoading(true);
    store.dispatch(loadingStarted);
    await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/profile',
    })
      .then((response) => {
        const profileInitialized = actionCreators.userProfile.setUserProfileDetails(
          response.data.profile,
        );
        store.dispatch(profileInitialized);
        this.updateUserProfilePicture(response.data.profile.profilePicture);
        const loadingFinished = actionCreators.userProfile.setLoading(false);
        store.dispatch(loadingFinished);

        return response.data.profile;
      })
      .catch((err) => {
        Bugtracker.captureException(err, { scope: 'UserProfileManager' });
        return null;
      });
  }

  getOtherUserProfile = async (id: string) => {
    return BackendApiClient.requestAuthorized({
      method: 'GET',
      url: `profile/${id}`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        Bugtracker.captureException(err, { scope: 'UserProfileManager' });
        return err;
      });
  };

  /**
   * Download user profile picture and save base64 outpout in redux
   * @function updateAsync
   *@param {name - string} - name of user
   *@param {profilePictureUrl - string} - profile picture url of user
   *@param {bio_text - string} - bio_text of user
   *@param {prompts - string} - profile prompts
   */
  updateAsync = async ({
    name,
    profilePictureUrl,
    gender,
    dateOfBirth,
    bio_text,
    prompts,
    invited_by_user,
  }: updateProfileParams) => {
    const data = new FormData();
    data.append('name', name);
    if (profilePictureUrl) {
      data.append('profilePicture', {
        uri: profilePictureUrl,
        name: profilePictureUrl.split('/').pop(),
        type: 'image/jpeg',
      });
    }
    if (gender) {
      data.append('gender', gender);
    }
    if (dateOfBirth) {
      data.append('dayOfBirth', dateOfBirth);
    }
    if (bio_text !== undefined) {
      data.append('bio_text', bio_text);
    }
    if (prompts !== undefined) {
      data.append('prompts', JSON.stringify(prompts));
    }
    if (invited_by_user) {
      data.append('invited_by_user', invited_by_user);
    }
    return BackendApiClient.requestAuthorized({
      method: 'POST',
      url: '/profile/update',
      data,
    })
      .then((response) => {
        this.updateProfileDetails(response.data.profile);
        ChatRoomManager.getRoomsListAsync();
        return response.data;
      })
      .catch((err) => {
        const { message } = err.data;
        this.showAlert(err.status, message);
        Bugtracker.captureException(err, { scope: 'UserProfileManager' });
        return err;
      });
  };

  showAlert = (err, message) => {
    switch (err) {
      case 400:
        Alert.alert('🤖 Moderation Alert 🤖', message, [{ text: 'OK' }], {
          cancelable: true,
        });
        break;
      case 422:
        Alert.alert(
          'Failed to update your profile 😕. Please check if you entered all your profile information.',
        );
        break;
      default:
        Alert.alert('Failed to update your profile 😕.');
    }
  };

  /**
   * Download user profile picture and save base64 outpout in redux
   * @function updateUserProfilePicture
   *@param {profilePictureUrl - string} - profile picture url
   */
  updateUserProfilePicture = (profilePictureUrl: string) => {
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', profilePictureUrl)
      .then((resp) => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then((base64Data) => {
        const action = actionCreators.userProfile.updateProfileImage(
          base64Data,
        );
        store.dispatch(action);
        return fs.unlink(imagePath);
      });
  };

  /**
   * Check if we are friends with the other user
   * @function getFriendshipStatus
   * @param {id- number} - Internal user id
   */
  getFriendshipStatus = async (id: string) => {
    return BackendApiClient.requestAuthorized({
      method: 'GET',
      url: `profile/${id}/friendship`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        Bugtracker.captureException(err, { scope: 'UserProfileManager' });
        return err;
      });
  };

  /**
   * Fetch paper plane badge for other user profile
   * @function fetchNextPageOtherUserProfile
   */
  fetchNextPageOtherUserProfile = async (relatedUser, page: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/paperplane/list?filter_group=Profile&profile=${relatedUser.id}&page=${page}`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log('err: ', err);
        return err;
      });
  };

  /**
   * Fetch paper plane badge for my profile
   * @function fetchPaperPlanesMyProfile
   */
  fetchPaperPlanesMyProfile = async (page?: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/paperplane/list?filter_group=Profile&page=${
        page ? page : 1
      }&page_size=20`,
    });
  };

  /**
   * Update all profile information in redux
   * @function updateProfileDetails
   */
  updateProfileDetails = (profile) => {
    const action = actionCreators.userProfile.setUserProfileDetails(profile);
    store.dispatch(action);
  };

  updateProfilePictureBase64 = async (profilePictureUrl) => {
    RNFS.readFile(profilePictureUrl, 'base64').then((base64Data) => {
      const action = actionCreators.userProfile.updateProfileImage(base64Data);
      store.dispatch(action);
    });
  };
}

export default new UserProfileManager();
