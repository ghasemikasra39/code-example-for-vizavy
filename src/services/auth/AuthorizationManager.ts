import BackendApiClient from '../api/BackendApiClient';
import FacebookAuthClient from './FacebookAuthClient';
import AuthorizationTokenStorage from './AuthorizationTokenStorage';
import NavigationService from '../utility/NavigationService';
import MixPanelClient, {
  LOGIN_SUCCESS,
  REGISTRATION_METHOD,
  SIGN_UP,
  PHONE,
  INVITED_BY_USER,
} from '../utility/MixPanelClient';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import {Bugtracker} from '../utility/BugTrackerService';
import {store} from '../../store';
import {actionCreators} from '../../store/actions';
import PusherClient from '../Pusher/PusherClient';
import UserProfileManager from '../api/UserProfileManager';
import {Alert} from 'react-native';
import {CommonActions} from '@react-navigation/native';

export const LOGIN_PROVIDER_FACEBOOK = 'Facebook';
export const LOGIN_PROVIDER_APPLE = 'Apple';
export const LOGIN_PROVIDER_OTP = 'OTP';

class AuthorizationManager {
  /**
   * Send user information to Crashlytics console when user is already logged in
   * @method crashlyticsTrackAuthorizedUser
   */
  async crashlyticsTrackAuthorizedUser() {
    // const userInfo = await AuthorizationTokenStorage.getUserInformation();

    // Bugtracker.crashlytics.log(
    //   'method crashlyticsTrackUser in AuthorizationManager.ts : 35',
    // );
    // await Promise.all([
    //   Bugtracker.crashlytics.setUserId(userInfo.id),
    //   Bugtracker.crashlytics.setUserName(userInfo.name),
    //   Bugtracker.crashlytics.setUserEmail(userInfo.email),
    //   Bugtracker.crashlytics.setAttributes({
    //     legacyMode: userInfo.legacyMode,
    //     token: userInfo.token,
    //     valid_until: userInfo.valid_until,
    //   }),
    // ]);
  }

  async handleFacebookLoginAsync() {
    const successHandler = async (tokenResponse) => {
      this.MixPanelTracker(tokenResponse);
      const {status, data} = tokenResponse;
      await this.tokenSaver(loginPayload, tokenResponse);

      return {status, data};
    };

    const failureHandler = (err) => {
      const {status, data} = err.response;
      return {status, data};
    };

    let loginPayload = await FacebookAuthClient.loginAsync();
    if (loginPayload.type == 'cancel') return;
    const requestConfig = {
      method: 'POST',
      url: '/login',
      data: {
        payload: loginPayload,
        provider: 'facebook',
      },
    };
    const promise = BackendApiClient.requestAsync(requestConfig);
    promise.then(successHandler, failureHandler);
    return promise;
  }

  async handleAppleLoginAsync(): Promise<boolean> {
    try {
      const nonce = this.nonceGenerator();
      const options = {
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      };

      let loginPayload = await AppleAuthentication.signInAsync(options);
      const requestConfig = {
        method: 'POST',
        url: '/login',
        data: {
          payload: loginPayload,
          provider: 'apple',
          nonce,
        },
      };

      const tokenResponse = await BackendApiClient.requestAsync(requestConfig);
      if (!tokenResponse.data.token) {
        throw new Error('login failed');
      } else if (tokenResponse.status === 200) {
        this.MixPanelTracker(tokenResponse);
        await this.tokenSaver(loginPayload, tokenResponse);
        return tokenResponse;
      }
      return false;
    } catch (e) {
      Bugtracker.Sentry.captureException(e);
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  handleOTPLogin(phone_number, code, inviteLink?) {
    const successHandler = async (tokenResponse) => {
      this.MixPanelTracker(tokenResponse);
      await this.tokenSaver(loginPayload, tokenResponse);
      return tokenResponse;
    };
    //Check if user logs in though an invite link
    let loginPayload = {
      payload: {
        phone_number: phone_number,
        otp: code,
        ref: inviteLink ? inviteLink : null,
      },
      provider: 'OTP',
    };
    const requestConfig = {
      method: 'POST',
      url: '/login',
      data: loginPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const promise = BackendApiClient.requestAsync(requestConfig);
    promise.then(successHandler).catch((err) => err);
    return promise;
  }

  async handleLogoutAsync(): Promise<void> {
    await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/logout',
    });
    await this.resetAuthorizationStateAsync();
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
    NavigationService.getNavigatorRef().current.dispatch(resetAction);
  }

  /**
   * Checks whether or not a user token is locally stored
   */
  async isUserTokenPresentAsync(): Promise<boolean> {
    const token = await AuthorizationTokenStorage.getUserTokenAsync();
    return token !== null;
  }

  /**
   * Passes the users auth token to the backend api
   */
  async authorizeUserAsync(): Promise<void> {
    const isToken = await this.isUserTokenPresentAsync();
    if (isToken) {
    } else {
      throw new Error('User cannot be authorized without user token');
    }
  }

  /**
   * Resets the authorization state by removing the user's auth token in all relevant places
   */
  resetAuthorizationStateAsync = async () => {
    const pusher = await PusherClient.connect();
    await AuthorizationTokenStorage.deleteUserTokenAsync();
    await AuthorizationTokenStorage.deleteUserRefreshTokenAsync();
    BackendApiClient.resetAuthorizationStateCache();
    await AsyncStorage.clear();
    this.cleanAndUnbindSubscriptions(pusher);
    MixPanelClient.reset()
  };

  cleanAndUnbindSubscriptions(pusher) {
    const {chatRoom, directChat} = store.getState();
    chatRoom.subscriptions.forEach((subName) => pusher.unsubscribe(subName));
    directChat.subscriptions.forEach((subName) => pusher.unsubscribe(subName));
    store.dispatch(actionCreators.chatRoom.removeSubscription());
    store.dispatch(actionCreators.directChat.removeSubscription());
    pusher.unbind_all();
  }

  nonceGenerator() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /*send user data to Mixpanel server */

  MixPanelTracker(tokenResponse) {
      const {id, email, name} = tokenResponse.data.user;
      MixPanelClient.identify(id)
      MixPanelClient.trackUserInformation({$email: email, $name: name});
  }

  /*
   * save user auth token, user information to the local storage
   * set auth token for BackendApiClient object
   * */
  async tokenSaver(loginPayload, tokenResponse) {
    const {token, refresh_token} = tokenResponse.data;
    await AuthorizationTokenStorage.storeUserTokenAsync(token);
    await AuthorizationTokenStorage.storeUserRefreshTokenAsync(refresh_token);
    BackendApiClient.cacheAuthToken(token);
    BackendApiClient.cacheRefreshToken(refresh_token);
    return true;
  }

  requestOTP(phone_number) {
    const requestConfig = {
      method: 'POST',
      url: '/one-time-password',
      data: {phone_number},
    };
    const promise = BackendApiClient.requestAsync(requestConfig);
    promise.then((res) => res).catch((err) => err);
    return promise;
  }

  /**
   * Navigate the user to either EditProfile or PaperPlane stack based on user profile initialization
   * @method handleLoginNavigation
   */
  handleLoginNavigation(data?) {
    const {appStatus} = store.getState();
    if (!appStatus.userProfileInitialized || !appStatus.introductionSeen) {
      NavigationService.navigate('App', {
        screen: 'EditProfile',
        params: {
          prevRoute: 'LoginScreen',
          data,
        },
      });
    } else {
      NavigationService.navigate('App', {screen: 'PaperPlane'});
    }
  }

  /**
   * handle MixPanel reporting
   * @method handleMixPanelReporting
   * @param {String} loginProvider - either LOGIN_PROVIDER_APPLE or LOGIN_PROVIDER_FACEBOOK
   */
  handleMixPanelReporting(loginProvider: any, data) {
    const {appStatus} = store.getState();

    if (!appStatus.userProfileInitialized) {
      MixPanelClient.trackEvent(SIGN_UP, {
        [REGISTRATION_METHOD]: loginProvider,
      });
      MixPanelClient.trackUserInformation({
        [REGISTRATION_METHOD]: loginProvider,
        authProvider: loginProvider,
      });
    }
    MixPanelClient.trackEvent(LOGIN_SUCCESS, {loginProvider});
  }

  triggerBlockedLocationAlert(message) {
    Alert.alert('App Not Available', message, [{text: 'OK'}], {
      cancelable: true,
    });
  }

  loginSuccessHandler = (loginProvider, data?) => {
    UserProfileManager.fetchProfileAsync();
    this.handleLoginNavigation(data);
    this.handleMixPanelReporting(loginProvider, data);
  };

  loginFailureHandler = (data, status) => {
    if (status == 403) this.triggerBlockedLocationAlert(data.message);
  };
}

export default new AuthorizationManager();
