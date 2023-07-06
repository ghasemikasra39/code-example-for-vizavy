import React from 'react';
import PaperPlaneDetailsScreen from '../screens/PaperPlane/PaperPlaneDetailsScreen';
import FollowersScreen from '../screens/FollowersScreen';
import ChatRoomScreen from '../screens/ChatRoom/ChatRoomScreen';
import UsersProfileScreen from '../screens/UsersProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import PaperPlaneBottomTabNavigator from './PaperPlaneBottomTabNavigator';
import { AppStackParamList } from './NavigationTypes';
import CreateRoomScreen from '../screens/ChatRoom/CreateRoomProzess/CreateRoomScreen';
import FriendsScreen from '../screens/FriendsScreen';
import TakePaperPlaneScreen from '../screens/TakePaperPlaneScreen';
import { store } from '../store';
import SearchScreen from '../screens/SearchScreen';
import SignupEditProfileScreen from '../screens/EditProfile/SignupEditProfileScreen';
import DirectChatRoomScreen from '../screens/DirectChat/DirectChatRoomScreen';
import InviteScreen from '../screens/InviteScreen';
import ExplainerSequenceScreen from '../screens/ExplainerSequenceScreen';
import TestScreen from '../screens/TestScreen';
import SendOutPaperPlaneScreen from '../screens/SendOutPaperPlaneScreen';
import NewsScreen from '../screens/News/NewsScreen';

const Stack = createStackNavigator<AppStackParamList>();

export default function AppStack() {
  function compileInitialRoute() {
    const appStatus = store.getState().appStatus;
    /**
     * If the user has successfully finished all the signUp process steps,
     * the `PaperPlane` screen will be shown, `EditProfile` otherwise
     */
    return appStatus.signUpInProgess === true ? 'EditProfile' : 'PaperPlane';
  }

  return (
    <Stack.Navigator
      initialRouteName={compileInitialRoute()}
      screenOptions={{
        // ...screensHeader,
        // ...screensAnimation,
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name="EditProfile"
        component={SignupEditProfileScreen}
        options={{
          headerShown: false,
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="PaperPlaneDetailsScreen"
        component={PaperPlaneDetailsScreen}
        options={{
          headerLeft: null,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="TakePaperPlaneScreen"
        component={TakePaperPlaneScreen}
        options={{
          headerLeft: null,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="PaperPlane"
        component={PaperPlaneBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowersScreen"
        component={FollowersScreen}
        options={{ headerShown: false, title: 'Followers' }}
      />
      <Stack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{ headerShown: false, title: 'Following' }}
      />
      <Stack.Screen
        name="UsersProfileScreen"
        component={UsersProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false, title: 'Settings' }}
      />
      <Stack.Screen
        name="CommentsScreen"
        component={ChatRoomScreen}
        options={{ headerShown: true, title: 'Comments' }}
      />
      <Stack.Screen
        name="CreateRoom"
        component={CreateRoomScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DirectChatRoomScreen"
        component={DirectChatRoomScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Invite"
        component={InviteScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
       <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="ExplainerSequenceScreen"
        component={ExplainerSequenceScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SendOutPaperPlaneScreen"
        component={SendOutPaperPlaneScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
