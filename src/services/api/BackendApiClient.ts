import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import AuthorizationTokenStorage from '../auth/AuthorizationTokenStorage';
import NavigationService from '../utility/NavigationService';
import { env } from '../../config';
import { Bugtracker } from '../utility/BugTrackerService';
import codePush from 'react-native-code-push';
import { store } from '../../store';

const AUTH_TOKEN_HEADER = 'X-API-AUTH-TOKEN';
const BLOCK_REPORT_MESSAGE =
  'Your account has been blocked because you violated against the community guidelines. Please click the contact button if you believe the blocking has been unjustified.';

export interface RequestConfigurationInterface {
  method: string;
  url: string;
  data: Object;
  total_count: number;
}

class BackendApiClient {
  // client used for createAuthRefreshInterceptor
  private client: AxiosInstance;
  // client used for fetching refresh token
  private clientRefresher: AxiosInstance;
  // client with no interceptor
  private clientPure: AxiosInstance;

  private authToken = null;
  private refreshToken = null;

  constructor() {
    this.client = axios.create({ baseURL: this.getApiBaseUrl() });
    this.clientRefresher = axios.create({ baseURL: this.getApiBaseUrl() });
    this.clientPure = axios.create({ baseURL: this.getApiBaseUrl() });

    createAuthRefreshInterceptor(this.client, this.refreshAuthLogic);

    this.client.interceptors.request.use(async (config) => {
      const isTesting = this.isTestingEnv();
      if (!isTesting) {
        return await this.authTokenAdder(config);
      } else {
        return config;
      }
    });

    this.clientRefresher.interceptors.request.use(async (config) => {
      const isTesting = this.isTestingEnv();
      if (!isTesting) {
        return await this.authTokenAdder(config);
      } else {
        return config;
      }
    });
  }

  refreshAuthLogic = async (failedRequest) => {
    // if codePush wants to restart the app at this moment, does not let him, because with this restart, the new pair is gone
    codePush.disallowRestart();
    const current_refresh_token = await this.getRefreshToken();
    const requestConfig =
      current_refresh_token === null
        ? { method: 'GET', url: '/tmp/fetch-token' }
        : {
          method: 'POST',
          url: '/refresh-token',
          data: { refresh_token: current_refresh_token },
        };
    const tokenResponse = await this.clientRefresher.request(requestConfig);
    const { token, refresh_token } = tokenResponse.data;
    await this.storeAuthToken(token);
    await this.storeRefreshToken(refresh_token);
    failedRequest.response.config.headers[AUTH_TOKEN_HEADER] = token;
    // let codePush restart the app safely because the new pair has been already saved
    codePush.allowRestart();
    return Promise.resolve();
  };

  async storeAuthToken(token) {
    await AuthorizationTokenStorage.storeUserTokenAsync(token);
    this.cacheAuthToken(token);
  }

  async storeRefreshToken(refresh_token) {
    await AuthorizationTokenStorage.storeUserRefreshTokenAsync(refresh_token);
    this.cacheRefreshToken(refresh_token);
  }

  async getAuthToken() {
    if (this.authToken === null) {
      const authToken = await AuthorizationTokenStorage.getUserTokenAsync();
      this.cacheAuthToken(authToken);
      return authToken;
    } else {
      return this.authToken;
    }
  }

  async getRefreshToken() {
    if (this.refreshToken === null) {
      const refreshToken = await AuthorizationTokenStorage.getUserRefreshTokenAsync();
      this.cacheRefreshToken(refreshToken);
      return refreshToken;
    } else {
      return this.refreshToken;
    }
  }

  resetAuthorizationStateCache() {
    this.authToken = null;
    this.refreshToken = null;
  }

  cacheAuthToken(authToken) {
    this.authToken = authToken;
  }

  cacheRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  /**
   * adds the auth token to the AUTH_TOKEN_HEADER header
   * @method authTokenAdder
   * @params {AxiosRequestConfig} configuration - the axios request object
   * @returns {AxiosRequestConfig} - the modified config that includes the auth token header
   */
  async authTokenAdder(configuration: AxiosRequestConfig) {
    const headers = configuration.headers || {};
    const authToken = await this.getAuthToken();
    headers[AUTH_TOKEN_HEADER] = authToken;
    return { ...configuration, headers };
  }

  private getApiBaseUrl(): string {
    return env.API_BASE_URL;
  }

  /**
   * Performs a request on the backend api
   *
   * @param configuration
   */
  async requestAsync(
    configuration: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const promise = this.clientPure.request(configuration);

    promise
      .then((res) => res)
      .catch((error) => {
        Bugtracker.Sentry.captureException(error);

        /*
         * If the user has been blocked/reported, stop here
         * and transfer the user to the Login screen
         */
        if (error.response.data.message === BLOCK_REPORT_MESSAGE)
          this.handleBlockReport();
        return error;
      });

    return promise;
  }

  /**
   * delete user token and navigate the user to the login screen
   * @method handleInvalidToken
   */
  async handleInvalidToken() {
    await AuthorizationTokenStorage.deleteUserTokenAsync();
    await AuthorizationTokenStorage.deleteUserRefreshTokenAsync();
    this.resetAuthorizationStateCache();
    NavigationService.navigate('Auth', {});
    this.clearReduxStore();
  }
  
  /**
   * Clear redux store
   * @method clearReduxStore
   */
  clearReduxStore() {
    store.dispatch({ type: 'RESET_STORE' });
  }

  /**
   * Performs an authorized request on the backend api
   * @method requestAuthorized
   * @param {object} configuration - Th∂e configuration to be used for http request
   * @returns {promise} - the axios promise
   */
  async requestAuthorized(
    configuration: AxiosRequestConfig,
  ): Promise<AxiosPromise> {
    const isTesting = this.isTestingEnv();
    if (!isTesting && (await this.getAuthToken()) === null) {
      await this.handleInvalidToken();
      return;
    }

    if (isTesting) {
      return axios(configuration);
    } else {
      return this.client.request(configuration);
    }
  }

  /**
   * Performs an authorized request on the backend api
   * @method requestAuthorizedAsync
   * @param {object} configuration - The configuration to be used for http request
   * @returns {Object} response - The axios resolved response
   */
  requestAuthorizedAsync = async (configuration: AxiosRequestConfig) => {
    let response;
    const isTesting = this.isTestingEnv();

    // when this.getAuthToken() returns 'undefined', does not mean that
    // the token is invalid, so will not trigger the if block. If the value is 'null'
    // means the token is invalid.
    const authToken = await this.getAuthToken();
    if (!isTesting && authToken === null) {
      await this.handleInvalidToken();
      return;
    }

    if (isTesting) {
      response = await axios(configuration);
      return response;
    } else {
      const promise = this.client.request(configuration);

      promise
        .then((response) => response)
        .catch((error) => {
          const { status, data } = error.response;
          if (axios.isCancel(error))
            console.log('Request canceled', error.message);

          /*
           * if the user has not used the app for more that 30 days and he's therefore considered logout from BE
           * i.e. This condition is met when the /refresh-token call fails
           * The status === 400 should be removed
           * */
          if (status === 401 || status === 400) {
            this.handleInvalidToken();
          }
          /*
           * If the user has been blocked/reported, stop here
           * and transfer the user to the Login screen
           */
          if (data.message === BLOCK_REPORT_MESSAGE) {
            this.handleBlockReport();
            return;
          }
          Bugtracker.Sentry.captureException(error);
          return error;
        });

      return promise;
    }
  };

  /**
   *
   * @param {boolean} isBlockedReported if the user has been blocked or reported.
   */
  async removeAuthStatusAsync(isBlockedReported?: boolean) {
    await AuthorizationTokenStorage.deleteUserTokenAsync();
    await AuthorizationTokenStorage.deleteUserRefreshTokenAsync();
    this.resetAuthorizationStateCache();
    NavigationService.navigate('Login', { isBlockedReported });
  }

  handleBlockReport = () => {
    this.removeAuthStatusAsync(true);
  };

  isTestingEnv = () => {
    return process.env.JEST_WORKER_ID !== undefined;
  };
}

export default new BackendApiClient();
