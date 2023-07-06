import {Alert} from 'react-native';
import BackendApiClient from './BackendApiClient';
import FormData from 'react-native/Libraries/Network/FormData';
import MixPanelClient, {
  DIRECT_CHAT_PROPOSED,
  OPEN_PAPER_PLANE,
} from '../utility/MixPanelClient';
import { store } from '../../store';
import { Bugtracker } from '../utility/BugTrackerService';
import AuthorizationTokenStorage from '../auth/AuthorizationTokenStorage';
import { actionCreators } from '../../store/actions';
import {
  CATCH_PP_FAILED,
  PP_UPLOAD_FAILED,
  PP_UPLOAD_LOADING,
  PP_UPLOAD_SUCCESSFUL,
} from '../../store/slices/PopupSlice';
import UserProfileManager from './UserProfileManager';
import MyProfileSlice from '../../store/slices/MyProfileSlice';
import { RequestsEnum } from '../utility/InitialLoadingService';
import NavigationService from "../utility/NavigationService";

export interface PaperPlaneInterface {
  id: string;
  type: string;
  publicUrl: string;
  publicThumbnailUrl: string;
  publicOverlayUrl: string;
  author: {
    id: string;
    location: {
      city?: string;
      country: string;
    };
    name: string;
    profilePicture: string;
  };
  upVotes: number;
  comments: number;
  message: string | null;
  inspiration: {
    id: number;
    text: string;
    icon: string;
  };
  location: {
    city?: string;
    country: string;
  };
  createdAt: string;
  fromGallery: boolean;
}

export interface PaperPlaneResponseInterface {
  data: PaperPlaneInterface[];
  current_page: number;
  pages_count: number;
  total_count: number;
}

class PaperPlaneManager {
  /**
   * Create and dispatch an action when CATCH_PP_FAILED occurs
   * @method dispatchCatchPPFailed
   */
  dispatchCatchPPFailed = () => {
    const action = actionCreators.popup.setPopup({
      enable: true,
      state: CATCH_PP_FAILED,
      message: 'Please check your internet connection',
    });
    store.dispatch(action);
  };

  /**
   * Fetch a new paper plane
   * @method requestPaperPlaneAsync
   * @return {PaperPlaneInterface}
   */
  requestPaperPlaneAsync = async (count?: number) => {
    if (!this.checkNetInfo()) {
      this.dispatchCatchPPFailed();
      return false;
    }
    const uri = `/paperplane/catch?count=${count ? count : 1}`;
    const config = {
      method: 'GET',
      url: uri,
    };

    return BackendApiClient.requestAuthorizedAsync(config)
      .then((response) => {
        if (response.data) {
          const { paper_planes } = response.data;
          this.appendPaperPlane(paper_planes);
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response.status === 404) this.dispatchCatchPPFailed();
        Bugtracker.Sentry.captureException(error);
        return false;
      });
  };

  /**
   * Fetch a list of new paper planes
   * @method requestPaperPlanesAsync
   */
  requestPaperPlanesAsync = async () => {
    const config = {
      method: 'GET',
      url: '/paper-planes',
    };
    return BackendApiClient.requestAuthorizedAsync(config)
      .then((response) => {
        const { paper_planes } = response.data;
        this.appendPaperPlane(paper_planes);
        return response.data;
      })
      .catch((error) => {
        Bugtracker.Sentry.captureException(error);
        return error;
      });
  };

  /**
   * Get query in order to request three initial paper planes from BE
   * @method compileQuery
   */
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
   * Append paper plane to existing paper plane list in redux
   * @method appendPaperPlane
   */
  appendPaperPlane = (paperPlanes: Array<Object>) => {
    const action = actionCreators.paperPlanes.prepend(paperPlanes);
    store.dispatch(action);
  };

  /**
   * Creates FormData from the given data
   * @method compileFormData
   * @param {String} type - the media type is an image or a video
   * @param {Number} inspirationId - what inspiration has been selected
   * @param {Boolean} gallery - if the pp is loaded from the gallery
   * @param {String} uri - Media uri
   * @param {String} overlayUri - uri generated from the editor
   * @param {String} message - none
   * @return {FormData} data -
   */
  compileFormData = (
    type: string,
    inspirationId: number,
    gallery: boolean,
    uri: string,
    overlayUri: string,
    message?: string,
  ) => {
    const data = new FormData();
    data.append('type', type);
    data.append('inspiration', inspirationId);
    data.append('fromGallery', gallery);
    data.append('mediaFile', {
      uri: uri,
      name: uri.split('/').pop(),
      type: this.guessMimeType(uri.split('.').pop()),
    });
    data.append('overlayFile', {
      uri: overlayUri,
      name: uri.split('/').pop(),
      type: this.guessMimeType(uri.split('.').pop()),
    });
    if (message) {
      data.append('message', message);
    }
    return data;
  };

  /**
   * Stores the failed PP in redux and dispatch respective actions
   * @method handleFailedPPReduxUpdate
   * @param {Axios configuration} requestConfig - the axios config object
   * @return null
   */
  handleFailedPPReduxUpdate = (requestConfig) => {
    const storeFailedPPAction = actionCreators.myProfile.setFailedPPs(
      JSON.stringify(requestConfig),
    );
    const failedPPAction = actionCreators.popup.setPopup({
      enable: true,
      state: PP_UPLOAD_FAILED,
      message: 'Upload failed. Please try again.',
    });
    store.dispatch(storeFailedPPAction);
    store.dispatch(failedPPAction);
    return null;
  };

  /**
   * Checks If there is an active network connection AND the internet
   * is reachable with the currently active network connection
   * @method checkNetInfo
   * @return {Boolean} - true if both are true. false otherwise
   */
  checkNetInfo = () => {
    const netInfo = store.getState().netInfo;
    return netInfo.isConnected && netInfo.isInternetReachable;
  };

  /**
   * Fetch the destination on which the newly created paper plane will land
   * @method getPaperPlaneDestinationAsync
   * @param {String} type - the media type is an image or a video
   * @param {Number} inspirationId - what inspiration has been selected
   * @param {Boolean} gallery - if the pp is loaded from the gallery
   * @param {String} uri - Media uri
   * @param {String} overlayUri - uri generated from the editor
   * @param {String} message - none
   * @return {Axios response}
   */
  uploadPaperPlane = async (
    type: string,
    inspirationId: number,
    gallery: boolean,
    uri: string,
    overlayUri: string,
    message?: string,
  ) => {
    const data = this.compileFormData(
      type,
      inspirationId,
      gallery,
      uri,
      overlayUri,
      message,
    );
    const requestConfig = {
      method: 'POST',
      url: '/paperplane',
      data,
    };
    if (!this.checkNetInfo())
      return this.handleFailedPPReduxUpdate(requestConfig);

    return BackendApiClient.requestAuthorizedAsync(requestConfig).then(
      (response) => {
        setTimeout(this.updateMyProfilePPs, 5000);
        return response.data;
      },
      (err) => {
        if (err.response.status == 403) {
          const message = 'We had to remove your paper plane because we identified it as inappropriate for Youpendo. We can’t review all images, so we gotta rely on our moderation bot.';
          Alert.alert('🤖 Moderation Alert 🤖', message, [{text: 'OK', onPress: () => NavigationService.navigate('PaperPlane')}], {cancelable: true});
        }
        this.handleFailedPPReduxUpdate(requestConfig)
      },
    );
  };

  /**
   * Convert stringified json back to formData type
   * @method toFormData
   * @param {Stringified json} json
   * @return {FormData} data
   */
  toFormData = (json) => {
    const data = new FormData();
    for (let pair of json) {
      data.append(pair[0], pair[1]);
    }
    return data;
  };

  /**
   * re-upload the failed PP
   * @method reUploadMediaAsync
   * @param {Axios request} requestConfig - the Axios request object
   * @return {Axios Promise}
   */
  reUploadMediaAsync = async (requestConfig) => {
    const action = actionCreators.popup.setPopup({
      enable: true,
      state: PP_UPLOAD_LOADING,
      message: 'Uploading...',
    });
    store.dispatch(action);

    const data = this.toFormData(requestConfig.data._parts);
    const updatedRequestConfig = {
      method: requestConfig.method,
      url: requestConfig.url,
      data: data,
    };

    BackendApiClient.requestAuthorizedAsync(updatedRequestConfig)
      .then((response) => {
        this.uploadMediaAsync(
          response.data.paper_plane.id,
          data._parts[0][1],
          data._parts[2][1],
          data._parts[1][1],
          data._parts[3][1],
          data._parts[4][1],
          '',
        );
        const action = actionCreators.popup.setPopup({
          enable: true,
          state: PP_UPLOAD_SUCCESSFUL,
          message: 'Upload successful',
        });
        store.dispatch(action);
        return response.data;
      })
      .catch(() => this.handleFailedPPReduxUpdate(updatedRequestConfig));
  };

  /**
   * Fetch first 20 PPs for the myProfile
   * @method updateMyProfilePPs
   */
  updateMyProfilePPs = async () => {
    const promise = UserProfileManager.fetchPaperPlanesMyProfile();
    promise.then(
      (paperList) => {
        store.dispatch(
          MyProfileSlice.actions.setPaperPlanes(paperList.data.paper_planes),
        );
      },
      (err) => {
        Bugtracker.captureException(err, { scope: 'InitialLoadingService' });
      },
    );
  };

  /**
   * Compile the MimeType based on the extension
   * @method guessMimeType
   * @param {String} extension - the extension of the media type
   * @return {String} - the correct MimeType based on the given extension
   */
  guessMimeType = (extension: string) => {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      default:
        return 'file/generic';
    }
  };

  /**
   * Mark paper plane as opened when they are opened
   * @method openPaperPlaneAsync
   * @param {String} id - the id of the seen paper plane
   * @return {Boolean}
   */
  openPaperPlaneAsync = async (id: string): Boolean => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'PATCH',
      url: '/paperplane/' + id + '/open',
    }).then(
      () => {
        MixPanelClient.trackEvent(OPEN_PAPER_PLANE, {
          paperplane: id,
        });

        MixPanelClient.registerSuperProperty(
          'last opened paper plane',
          new Date(Date.now()).toLocaleString(),
        );
        return true;
      },
      (error) => {
        Bugtracker.Sentry.captureException(error);
        return false;
      },
    );
  };

  /**
   * Fetch paperPlanes entries for MyProfileScreen
   * @method fetchMyProfilePPEntries
   * @param {number} page - the pagination page number for which the PPs are fetched
   */
  fetchMyProfilePPEntries = async (page) => {
    const authToken = await AuthorizationTokenStorage.getUserTokenAsync();
    const action = actionCreators.paperPlanes.fetchMyProfilePPEntries({
      page,
      authToken,
    });
    store.dispatch(action);
  };

  /**
   * Reply on a paper plane
   * @method data
   * @param {paperPlaneId} - id of paper plane
   * @param {message} - the reply message that the user has written to the paper plane
   */
  replyOnPaperPlane = async (paperPlaneId: string, message: string) => {
    const data = {
      paper_plane: paperPlaneId,
      message: message,
    };
    return BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: '/paper-plane-reactions',
      data,
    }).then(
      (response) => {
        const { direct_chat, direct_chat_message } = response.data;
        MixPanelClient.trackEvent(DIRECT_CHAT_PROPOSED);
        this.addNewDirectChatToRedux(direct_chat);
        this.addNewDirectChatMessageToRedux(direct_chat_message);
        return response.data;
      },
      (error) => {
        Bugtracker.Sentry.captureException(error);
        return error;
      },
    );
  };

  /**
   * Add new chat to redux instantly
   * @method addNewDirectChatToRedux
   * @param {direct_chat} - new direct chat object
   */
  addNewDirectChatToRedux = (direct_chat) => {
    const action = actionCreators.directChat.addNewDirectChat({
      direct_chat,
      amIDirectOwner: true,
    });
    store.dispatch(action);
  };

  /**
   * Add new attached message to a direct chat in redux instantly
   * @method addNewDirectChatMessageToRedux
   * @param {direct_chat_message} - new message attached to direct chat
   */
  addNewDirectChatMessageToRedux = (direct_chat_message: Object) => {
    const { navigation } = store.getState();
    const action = actionCreators.directChat.addNewDirectMessage({
      newMessage: direct_chat_message,
      sentViaLoggedInUser: true,
      navigation,
      replyToPaperPlane: true,
    });
    store.dispatch(action);
  };
}

export default new PaperPlaneManager();
