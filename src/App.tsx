import React from 'react';
import { AppState } from 'react-native';
import AppContainer from './navigation/AppContainer';
import { InitialProps } from 'expo/build/launch/withExpoRoot.types';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { View } from 'react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';
import NavigationService from './services/utility/NavigationService';
import { DeviceMotion } from 'expo-sensors';
import AuthorizationManager from './services/auth/AuthorizationManager';
import MixPanelClient, { APP_OPENED } from './services/utility/MixPanelClient';
import NotificationsManager from './services/api/NotificationsManager';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationPopup from './component-library/NotificationPopup';
import ScreenSwitcher from 'react-native-device-screen-switcher';
import { CommonActions } from '@react-navigation/native';
import PushNotificationSubscriber from './services/api/PushNotificationSubscriber';
import NetInfoUnsubscribe from '../src/services/utility/NetInfo';
import RNBootSplash from 'react-native-bootsplash';
import Loading from './component-library/Loading';
import codePush from 'react-native-code-push';


interface State {
  isReady: boolean;
}

// MixPanelClient.autoIdentifyAsync();

class App extends React.Component<InitialProps, State> {
  orientationTimeout: ReturnType<typeof setTimeout>;
  state = { isReady: false };

  componentDidMount() {
    RNBootSplash.hide();
    this.initializeApplicationAsync();
    // this.trackUsage();
    this.addDebugMenuListener();
    PushNotificationSubscriber.registerForPushNotificationsAsync();
    PushNotificationSubscriber.resetNotificationBadgeCount();
  }

  componentWillUnmount() {
    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
    AppState.removeEventListener('change', () =>
      PushNotificationSubscriber.setNotificationListener(),
    );
    if (!__DEV__) NetInfoUnsubscribe();
  }

  render() {
    return (
      <ScreenSwitcher data-test={'component-app'}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={<View />} persistor={persistor}>
              <AppContainer />
              <NotificationPopup />
              <Loading />
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </ScreenSwitcher>
    );
  }

  // trackUsage = () => {
  //   MixPanelClient.autoIdentifyAsync().then(() => {
  //     MixPanelClient.trackEvent(APP_OPENED);
  //   });
  // };

  initializeApplicationAsync = async () => {
    if (await AuthorizationManager.isUserTokenPresentAsync()) {
      NotificationsManager.cleanupOldNotifications();
      await AuthorizationManager.isUserTokenPresentAsync();
    } else {
      await AuthorizationManager.isUserTokenPresentAsync();
    }
  };

  addDebugMenuListener = async () => {
    if (!__DEV__) return;

    let orientationLeftCount = 0;
    if (await DeviceMotion.isAvailableAsync()) {
      DeviceMotion.setUpdateInterval(1000);
      DeviceMotion.addListener((motionData) => {
        if (motionData.orientation === -90) orientationLeftCount++;
        else orientationLeftCount = 0;

        if (orientationLeftCount === 3) {
          NavigationService.navigate(
            'App',
            {},
            CommonActions.navigate({
              name: 'DebugScreen',
            }),
          );
          this.orientationTimeout = setTimeout(() => {
            orientationLeftCount = 0;
          }, 2500);
        }
      });
    }
  };
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export default codePush(codePushOptions)(App);
