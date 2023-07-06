import BackendApiClient from './BackendApiClient';
import DevLogger from '../utility/DevLogger';
import { Bugtracker } from '../utility/BugTrackerService';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';
import {
  PP_UPLOAD_FAILED,
  PP_UPLOAD_LOADING,
  PP_UPLOAD_SUCCESSFUL,
} from '../../store/slices/PopupSlice';

export interface PaperPlaneCommentDataInterface {
  id: string;
  parentCommentId: string;
  childComments?: PaperPlaneCommentInterface;
  appUser: {
    id: string;
    location: {
      city?: string;
      country: string;
    };
    name: string;
    profilePicture: string;
  };
  message: string;
  type: string;
  publicUrl: string;
  publicThumbnailUrl: string;
  publicOverlayUrl: string;
  fromGallery: boolean;
  createdAt: string;
  upvotes: number;
}

export interface PaperPlaneCommentInterface {
  data: PaperPlaneCommentDataInterface[];
  current_page: number;
  pages_count: number;
  total_count: number;
}

class PaperPlaneReplyManager {
  /**
   * Creates FormData from the given data
   * @method compileFormData
   * @param {String} type - the media type is an image or a video
   * @param {String} message - none
   * @param {String} paperPlaneId - the id of paper plane
   * @param {String} uri - Media uri
   * @param {String} overlayUri - uri generated from the editor
   * @param {Boolean} gallery - if the pp is loaded from the gallery
   * @param {String} parentCommentId - the id of the parent paper plane
   * @return {FormData} data -
   */
  compileFormData(
    type: string,
    message: string,
    paperPlaneId: string,
    uri: string,
    overlayUri: string,
    gallery: boolean,
    parentCommentId?: string,
  ) {
    const data = new FormData();
    data.append('type', type);
    data.append('message', message);
    data.append('paperPlaneId', paperPlaneId);
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
    parentCommentId && data.append('parentCommentId', parentCommentId);
    return data;
  }

  /**
   * Stores the failed PP in redux and dispatch respective actions
   * @method handleFailedPPReduxUpdate
   * @param {Axios configuration} requestConfig - the axios config object
   * @return null
   */
  handleFailedReplyReduxUpdate = (requestConfig) => {
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
   * Upload a reply
   * @method createAsync
   * @param {String} type - the media type is an image or a video
   * @param {String} message - none
   * @param {Number} paperPlaneId - the id of the paper plane to which this reply belongs
   * @param {String} uri - Media uri
   * @param {String} overlayUri - uri generated from the editor
   * @param {Boolean} gallery - if the pp is loaded from the gallery
   * @param {String} parentCommentId - the parent paper plane id
   * @return {PaperPlaneCommentInterface}
   */
  async createAsync(
    type: string,
    message: string,
    paperPlaneId: string,
    uri: string,
    overlayUri: string,
    gallery: boolean,
    parentCommentId?: string,
  ): Promise<PaperPlaneCommentInterface> {
    const data = this.compileFormData(
      type,
      message,
      paperPlaneId,
      uri,
      overlayUri,
      gallery,
      parentCommentId,
    );
    const action = actionCreators.popup.setPopup({
      enable: true,
      state: PP_UPLOAD_LOADING,
      message: 'Uploading...',
    });
    store.dispatch(action);
    const requestConfig = {
      method: 'POST',
      url: '/paperplane-comments',
      data,
    };
    if (!this.checkNetInfo())
      return this.handleFailedReplyReduxUpdate(requestConfig);
    return BackendApiClient.requestAuthorizedAsync(requestConfig).then(
      (response) => {
        const action = actionCreators.popup.setPopup({
          enable: true,
          state: PP_UPLOAD_SUCCESSFUL,
          message: 'Upload successful',
        });
        store.dispatch(action);
        return response.data.comment;
      },
      (error) => {
        this.handleFailedReplyReduxUpdate(requestConfig);
        Bugtracker.Sentry.captureException(error);
        return null;
      },
    );
  }

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
   * @method reUploadReplyAsync
   * @param {Axios request} requestConfig - the Axios request object
   * @return {Axios Promise}
   */
  reUploadReplyAsync = async (requestConfig) => {
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
        const action = actionCreators.popup.setPopup({
          enable: true,
          state: PP_UPLOAD_SUCCESSFUL,
          message: 'Upload successful',
        });
        store.dispatch(action);
        return response.data;
      })
      .catch(() => {
        this.handleFailedReplyReduxUpdate(updatedRequestConfig);
      });
  };

  /**
   * Fetch replies of a specific paper plane
   * @method fetchByPaperPlaneAsync
   * @param {String} paperPlaneId - the id of the paper plane, for which the replies are fetched
   * @param {Number} page - the page, used for pagination
   * @param {Object} axiosCancelSource - the axios cancel object, used for request cancellation
   * @return {Array} - the replies
   */
  async fetchByPaperPlaneAsync(
    paperPlaneId: string,
    page?: number,
    axiosCancelSource?: object,
  ) {
    const response = await BackendApiClient.requestAuthorized({
      method: 'GET',
      url: `/paperplane/${paperPlaneId}/comments${page ? `?page=${page}` : ''}`,
      cancelToken: axiosCancelSource,
    });
    return response.data.comments;
  }

  /**
   * Fetch the replies of a reply
   * @method fetchByReplyAsync
   * @param {String} replyId - the id of the reply for which the replies are fetched
   * @param {Number} page - the page, used for pagination
   * @return {Array} - the replies
   */
  async fetchByReplyAsync(
    replyId: string,
    page?: number,
  ): Promise<PaperPlaneCommentInterface> {
    const response = await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/paperplane-comments/${replyId}/children${
        page ? `?page=${page}` : ''
      }`,
    });
    DevLogger.log(response.data);
    if (!response || response.status !== 200 || !response.data.success) {
      return { data: [], current_page: 0, pages_count: 0 };
    }
    return response.data.children;
  }

  /**
   * Delete a reply
   * @method deleteAsync
   * @param {String} commentId - the id of the reply
   * @return {Boolean}
   */
  async deleteAsync(commentId: string): Promise<boolean> {
    const requestConfig = {
      method: 'DELETE',
      url: '/paperplane-comments/' + commentId,
    };
    return BackendApiClient.requestAuthorizedAsync(requestConfig).then(
      (response) => {
        return response.data;
      },
      (error) => {
        Bugtracker.Sentry.captureException(error);
        return error;
      },
    );
  }

  /**
   * Delete a paper plane
   * @method deletePaperPlaneAsync
   * @param {String} paperPlaneId - the id of the paper plane
   * @return {Boolean}
   */
  async deletePaperPlaneAsync(paperPlaneId: string): Promise<boolean> {
    const response = await BackendApiClient.requestAuthorizedAsync({
      method: 'DELETE',
      url: '/paperplane/' + paperPlaneId,
    });
    DevLogger.log(response.data);

    if (!response || response.status !== 200 || !response.data.success) {
      return false;
    }

    return true;
  }

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
}

export default new PaperPlaneReplyManager();
