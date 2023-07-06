import PermissionRequester from '../utility/PermissionRequester';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';
import { Constants } from 'react-native-unimodules';
import BackendApiClient from './BackendApiClient';
import MixPanelClient, { ENABLE_LOCATION, BLOCK_USER_FROM_BLACKLISTED_COUNTRY } from '../utility/MixPanelClient';
import AuthorizationManager from '../auth/AuthorizationManager';
import { Bugtracker } from '../utility/BugTrackerService';
import NavigationService from '../utility/NavigationService';

class LocationManager {
  triggerLocationSubmissionAsync = async (): Promise<boolean> => {
    if (await PermissionRequester.requestAsync(Permissions.LOCATION)) {
      MixPanelClient.trackUserInformation({ [ENABLE_LOCATION]: true });
      this.submitLocationAsync();
      return true;
    }
    MixPanelClient.trackUserInformation({ [ENABLE_LOCATION]: false });
    return false;
  };

  private submitLocationAsync = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      Alert.alert('Oops', 'Location is not supported in emulator.');
    }
    let location: Location.LocationData | null = null;
    try {
      location = await Location.getCurrentPositionAsync();
    } catch {
      try {
        location = await Location.getCurrentPositionAsync();
      } catch {}
    }
    const data = {
      lat: location ? location.coords.latitude : null,
      long: location ? location.coords.longitude : null,
    };
    const response = await BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: '/location',
      data,
    });
    if (response.data.location && response.data.location.city) {
      MixPanelClient.registerSuperProperty('City', response.data.location.city);
      MixPanelClient.trackUserInformation({
        $city: response.data.location.city,
      });
    }
    if (response.data.location && response.data.location.country) {
      MixPanelClient.registerSuperProperty(
        'Country',
        response.data.location.country,
      );
      MixPanelClient.trackUserInformationOnce({
        Country: response.data.location.country,
      });
    }
  };

   /**
   * Check if user is from blacklisted country
   * @function checkLocation
   */
  checkLocation = async () => {
    function validateLocation(data) {
      const { success, message } = data;
      if (!success) {
        AuthorizationManager.resetAuthorizationStateAsync();
        const navigationRef = NavigationService.getNavigatorRef();
        navigationRef.current.navigate('Auth', {
          screen: 'Login',
          params: { isLocationBlocked: true, data: message },
        });
        MixPanelClient.trackEvent(BLOCK_USER_FROM_BLACKLISTED_COUNTRY);
      }
    }

    function failureHandler(err) {
      const { data } = err.response;
      validateLocation(data);
    }

    const location = await Location.getCurrentPositionAsync();
    const {latitude, longitude} = location.coords;
    const promise = BackendApiClient.requestAuthorized({
      method: 'GET',
      url: `/location-verification?lat=${latitude}&long=${longitude}`,
    });
    promise.catch((err) => {
      failureHandler(err);
      Bugtracker.captureException(err, { scope: 'LocationManager' });
    });
  };
}

export default new LocationManager();
