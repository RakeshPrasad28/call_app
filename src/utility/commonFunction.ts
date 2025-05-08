import {
  ColorValue,
  Platform,
  StatusBar,
  StatusBarStyle
} from 'react-native';
import NavigationService from '../NavigationService';

//NAVIGATION FUNCTIONS
export const navigate = (routeName: string, params?: Record<string, any>) => {
  //code to tarck
  NavigationService.navigate(routeName, params);
};

export const replace = (routeName: string, params?: Record<string, any>) => {
  NavigationService.replace(routeName, params);
};

export const goBack = () => {
  NavigationService.back();
};

export const openDrawer = () => {
  NavigationService.openDrawer();
};

export const closeDrawer = () => {
  NavigationService.closeDrawer();
};

export const clearStack = (routeName: string, params = {}) => {
  NavigationService.clearStack(routeName, params);
};

export const push = (routeName: string, params = {}) => {
  NavigationService.push(routeName, params);
};

//STATUSBAR & SAFEAREAVIEW FUNCTIONS
export const changeStatusBarColor = (
  top: ColorValue,
  style: StatusBarStyle,
) => {
  StatusBar.setBarStyle(style);
  if (Platform.OS == 'android') {
    StatusBar.setBackgroundColor(top);
  }
};