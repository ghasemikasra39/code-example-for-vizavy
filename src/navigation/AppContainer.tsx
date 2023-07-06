import AuthorizationStack from './AuthorizationStack';
import AppStack from './AppStack';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthorizationManager from '../services/auth/AuthorizationManager';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, StyleSheet, View, AppState } from 'react-native';
import NavigationService from '../services/utility/NavigationService';
import ChatRoomManager from '../services/api/ChatRoomManager';
import InitialLoadingService, {
  RequestsEnum,
} from '../services/utility/InitialLoadingService';
import { actionCreators } from '../store/actions';
import FriendshipManager from '../services/api/FriendshipManager';
import NotificationsManager from '../services/api/NotificationsManager';
import AuthorizationTokenStorage from '../services/auth/AuthorizationTokenStorage';
import { store } from '../store';
import CodePushService from '../services/utility/CodePushService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import MixPanelClient, {APP_OPENED} from "../services/utility/MixPanelClient";

const Stack = createStackNavigator();

export default function AppContainer() {
  const navigatorRef = React.useRef(null);
  const routeNameRef = React.useRef();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    NavigationService.setTopLevelNavigator(navigatorRef);
  });

  useEffect(() => {
    async function checkUserAuthorization() {
      try {
        await AuthorizationManager.authorizeUserAsync();
        setIsLoggedIn(true);
        trackUsage()
      } catch {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    }

    checkUserAuthorization();
  });

  useEffect(() => {
    /**
     * Event listener for receiving dynamic link that user has opened the app with
     * @function handleDynamicLink
     */
    ChatRoomManager.handleDynamicLink();
  }, []);

  useEffect(() => {
    if (isLoggedIn) InitialLoadingService.loadAllData();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const action = actionCreators.navigation.clearNavigationInformation();
    dispatch(action);

    const appStatusAction = actionCreators.appStatus.resetAppState();
    dispatch(appStatusAction);

    AppState.addEventListener('change', (status) => {
      try {
        const action = actionCreators.appStatus.setAppState(status);
        dispatch(action);
        const appState = store.getState()?.appStatus?.appState;
        if (status === 'active') onDidFocus();
      } catch (error) {
        console.log('error: ', error);
      }
    });

    return () => {
      AppState.removeEventListener('change', onDidFocus);
    };
  }, []);


  function trackUsage() {
    MixPanelClient.autoIdentifyAsync().then(() => {
      MixPanelClient.trackEvent(APP_OPENED);
    });
  };

  /**
   * Refresh data when app was in background
   * @function refresh
   */
  async function onDidFocus() {
    const currentRoute = navigatorRef.current?.getCurrentRoute()?.name;
    if (
      currentRoute === 'DiscoverScreen' ||
      currentRoute === 'Rooms' ||
      currentRoute === 'DirectRoomsScreen' ||
      currentRoute === 'MyProfileScreen'
    ) {
      CodePushService.getCodePushUpdate();
    }
    const token = await AuthorizationTokenStorage.getUserTokenAsync();
    /**
     * this condition handles the when user is redirected to the app after facebook authentication
     * At this time, user does not have the token and the refresh_token yes, so all the api calls below will fail
     */
    if (token !== null) {
      InitialLoadingService.loadAllData([
        RequestsEnum.CURENT_ROOMS,
        RequestsEnum.EXPIRED_ROOMS,
        RequestsEnum.FRIENDSHIP_REQUESTS,
        RequestsEnum.NOTIFICATIONS,
        RequestsEnum.REFERRAL_INVITES,
        RequestsEnum.PROFILE,
        RequestsEnum.DIRECT_CHATS,
      ]);
    }
    resetNotificationBadgeCount();
  }

  /**
   * Reset badge count on app icon
   * @function resetNotificationBadgeCount
   */
  function resetNotificationBadgeCount() {
    const action = actionCreators.notifications.setBadgeNotificationCount(0);
    store.dispatch(action);
  }

  function NavigationContainerOnReadyHandler() {
    const currentRoute = navigatorRef.current.getCurrentRoute();
    routeNameRef.current = currentRoute;
  }

  function NavigationContainerOnStateChangeHandler(tree) {
    const options = navigatorRef.current?.getCurrentOptions();
    const currentRoute = navigatorRef.current?.getCurrentRoute();
    const previousRoute = routeNameRef.current;
    routeNameRef.current = currentRoute;

    const action = actionCreators.navigation.setNavigationInformation({
      tree,
      currentRoute,
      previousRoute,
      options,
    });
    dispatch(action);
  }

  if (isLoading) {
    return (
      <View style={styles.view}>
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigatorRef}
      onReady={NavigationContainerOnReadyHandler}
      onStateChange={NavigationContainerOnStateChangeHandler}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="App" component={AppStack} />
            <Stack.Screen name="Auth" component={AuthorizationStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthorizationStack} />
            <Stack.Screen name="App" component={AppStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    marginBottom: 20,
  },
});
