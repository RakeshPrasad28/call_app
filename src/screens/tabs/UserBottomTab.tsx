import React, {FC} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import Logs from '../app/Logs';
import Home from '../app/Home';
import SettingScreen from '../app/settings/SettingScreen';

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
