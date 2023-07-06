import * as SecureStore from 'expo-secure-store';

const USER_TOKEN_STORAGE_KEY = 'auth.user.token';
const USER_REFRESH_TOKEN = 'auth.user.token.refresh';
const USER_ID = 'user.id';
const USER_NAME = 'user.display.name';
const USER_EMAIL = 'user.email';
const TOKEN_VALID_UNTIL = 'token.expiry.date';
const LOGIN_LEGACY_MODE = 'login.mode';

class AuthorizationTokenStorage {
  /**
   * Gets the user token from the local secure store
   */
  async getUserTokenAsync(): Promise<string | null> {
    const token = await SecureStore.getItemAsync(USER_TOKEN_STORAGE_KEY);
    return token;
  }

  async getUserRefreshTokenAsync() {
    return SecureStore.getItemAsync(USER_REFRESH_TOKEN)
      .then(refreshToken => {
        return refreshToken;
      })
      .catch(error => {
        return null;
      })
  }

  /**
   * Stores the user token to the local secure store
   * @param token
   */
  async storeUserTokenAsync(token: string): Promise<void> {
    return await SecureStore.setItemAsync(USER_TOKEN_STORAGE_KEY, token);
  }

  async storeUserRefreshTokenAsync(refreshToken: string): Promise<void> {
    return await SecureStore.setItemAsync(USER_REFRESH_TOKEN, refreshToken);
  }

  /**
   * Removes the user token from secure store
   */
  async deleteUserTokenAsync(): Promise<void> {
    if (await this.getUserTokenAsync()) {
      return await SecureStore.deleteItemAsync(USER_TOKEN_STORAGE_KEY);
    }
  }

  async deleteUserRefreshTokenAsync(): Promise<void> {
    if (await this.getUserRefreshTokenAsync()) {
      return await SecureStore.deleteItemAsync(USER_REFRESH_TOKEN);
    }
  }

  // /*
  //  * Store user information for future Crashlytics tracking
  //  */
  // async storeUserInformation(tokenResponse): Promise<void> {
  //   await Promise.all([
  //     SecureStore.setItemAsync(USER_ID, tokenResponse.data.user.id),
  //     SecureStore.setItemAsync(USER_NAME, tokenResponse.data.user.name),
  //     SecureStore.setItemAsync(USER_EMAIL, tokenResponse.data.user.email),
  //     SecureStore.setItemAsync(TOKEN_VALID_UNTIL, tokenResponse.data.valid_until),
  //   ]);
  // }

  // /*Gets user information*/
  // async getUserInformation() {
  //   const values = await Promise.all([
  //     SecureStore.getItemAsync(USER_ID),
  //     SecureStore.getItemAsync(USER_NAME),
  //     SecureStore.getItemAsync(USER_EMAIL),
  //     SecureStore.getItemAsync(TOKEN_VALID_UNTIL),
  //     SecureStore.getItemAsync(USER_TOKEN_STORAGE_KEY),
  //   ]);
  //
  //   return {
  //     id: values[0],
  //     name: values[1],
  //     email: values[2],
  //     valid_until: values[3],
  //     token: values[4],
  //   };
  // }
}

export default new AuthorizationTokenStorage();
