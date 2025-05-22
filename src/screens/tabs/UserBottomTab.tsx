import React, {FC} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import Logs from '../app/Logs';
import SettingScreen from '../app/settings/SettingScreen';
import Home from '../app/home';

const Tab = createBottomTabNavigator();
const UserBottomTab: FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props)=><CustomTabBar {...props}/>}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Logs" component={Logs} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default UserBottomTab;
