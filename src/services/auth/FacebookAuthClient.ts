import {env} from '../../config';
import Linking from 'react';
import * as Facebook from 'expo-facebook';

const RETURN_URL = 'facebook-login-return';

class FacebookAuthClient {
  loginAsync = async () => {
    try {
      await Facebook.initializeAsync(this.getFacebookAppId());
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });

      if (result.type === 'cancel') {
        return result;
      }

      if (result.type === 'success') {
        return {
          redirect_url: this.getRedirectUrl(),
          token: result.token,
          expires: result.expires,
          type: result.type,
        };
      }
    } catch ({message}) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  private getAuthUrl = (): string => {
    return (
      env.FACEBOOK_OAUTH +
      `client_id=${this.getFacebookAppId()}` +
      `&redirect_uri=${encodeURIComponent(this.getRedirectUrl())}` +
      `&response_type=code&scope=email` +
      `&state=${encodeURIComponent(this.getState())}`
    );
  };

  private getRedirectUrl = (): string => env.REDIRECT_URL;

  private getReturnUrl = (): string => Linking.makeUrl(RETURN_URL);

  private getFacebookAppId = (): string => env.FACEBOOK_APP_ID;

  private getState = (): string => `so:1|` + `ru:${this.getReturnUrl()}`;
}

export default new FacebookAuthClient();
