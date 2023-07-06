import React, { useEffect } from 'react';
import CustomBottomTabBar from '../component-library/CustomBottomTabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperPlaneBottomTabNavigatorParamList } from './NavigationTypes';
import RoomsScreen from '../screens/ChatRoom/RoomsScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import CodePushService from '../services/utility/CodePushService';
import DiscoverScreen from '../screens/DiscoverScreen';
import DirectRoomsScreen from '../screens/DirectChat/DirectRoomsScreen';

const Tab = createBottomTabNavigator<PaperPlaneBottomTabNavigatorParamList>();

export default function PaperPlaneBottomTabNavigator() {
  useEffect(() => {
    CodePushService.getCodePushUpdate();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="DiscoverScreen"
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      tabBarOptions={{ style: { marginBottom: 20 } }}>
      <Tab.Screen name="DiscoverScreen" component={DiscoverScreen} />
      <Tab.Screen name="DirectRoomsScreen" component={DirectRoomsScreen} />
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="MyProfileScreen" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}
