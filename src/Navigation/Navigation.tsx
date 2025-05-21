import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import AnimatedTabs from '../screens/tabs/AnimatedTabs';
import { navigationRef } from '../utility/NavigationUtils';
import SplashScreen from '../screens/app/SplashScreen';
import PersonCallLogs from '../components/PersonCallLogs';
import FilteredCallLogs from '../components/FilteredCallLogs';
import LoginScreen from '../screens/app/LoginScreen/LoginScreen';
import ForgotPasswordScreen from '../screens/app/Forgotpassword/ForgotPasswordScreen';



const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false, animation: 'fade'}} initialRouteName='Login'>
        {/* <Stack.Screen name='SplashScreen' component={SplashScreen}/> */}
        <Stack.Screen name='UserBottomTab' component={AnimatedTabs}/>
        <Stack.Screen name='FilteredCallLogs' component={FilteredCallLogs}/>
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name='PersonCallLogs' component={PersonCallLogs}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
