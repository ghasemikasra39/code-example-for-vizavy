import FacebookAuthClient from '../../src/services/auth/FacebookAuthClient';
import BackendApiClient from '../../src/services/api/BackendApiClient';
import AuthorizationManager from '../../src/services/auth/AuthorizationManager';
import * as SecureStore from 'expo-secure-store';


jest.mock('../../src/services/auth/FacebookAuthClient');
jest.mock('../../src/services/api/BackendApiClient');
jest.mock('expo-secure-store');

const FacebookAuthClientMock = FacebookAuthClient as jest.Mocked<typeof FacebookAuthClient>
const BackendApiClientMock = BackendApiClient as jest.Mocked<typeof BackendApiClient>
const SecureStoreMock = SecureStore as jest.Mocked<typeof SecureStore>

describe('Authorization Manager', () => {
  it ('handles facebook login properly', async () => {
    FacebookAuthClientMock.loginAsync.mockImplementationOnce(async () =>
      Promise.resolve({
        code: 'test',
        redirect_url: 'test',
      })
    );
    BackendApiClientMock.requestAsync.mockImplementationOnce(() =>
      Promise.resolve({
        data: { token: 'dummy', user : { id: 'test' } },
        status: 200,
        statusText: 'test',
        headers: {},
        config: {}
      })
    );

    await AuthorizationManager.handleFacebookLoginAsync();
    expect(FacebookAuthClientMock.loginAsync).toHaveBeenCalled();
    expect(BackendApiClientMock.setAuthToken).toHaveBeenCalled();
    expect(SecureStoreMock.setItemAsync).toHaveBeenCalled();
  });
});
