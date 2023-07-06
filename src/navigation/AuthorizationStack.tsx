import LoginScreen from '../screens/LoginScreen';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import { AuthorizationStackParamList } from './NavigationTypes';
import EnterNumberScreen from '../screens/OTP/EnterNumberScreen';
import EnterOTPScreen from '../screens/OTP/EnterOTPScreen';
import LoginOtherOptionsScreen from '../screens/LoginOtherOptionsScreen';

const Stack = createStackNavigator<AuthorizationStackParamList>();

export default function AuthorizationStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EnterNumberScreen" component={EnterNumberScreen} />
      <Stack.Screen name="EnterOTPScreen" component={EnterOTPScreen} />
      <Stack.Screen
        name="LoginOtherOptions"
        component={LoginOtherOptionsScreen}
        options={{
          headerLeft: null,
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
    </Stack.Navigator>
  );
}
