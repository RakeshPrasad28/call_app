import { StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSharedState} from './SharedContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import { HomeTabIcon, LogsTabIcon, SettingsTabIcon } from './TabIcon';
import { BOTTOM_TAB_HEIGHT, Colors, Fonts } from '../../utility/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const CustomTabBar: FC<BottomTabBarProps> = props => {
  const {translationY} = useSharedState();
  const {state, navigation} = props;
  const bottom = useSafeAreaInsets();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -translationY.value}],
    };
  });
  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        animatedStyle,
        {paddingBottom: bottom.bottom},
        {backgroundColor: darkMode ? Colors.cerebralGrey : Colors.white},
      ]}>
      {state.routes?.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={index}
            onLongPress={onLongPress}
            onPress={onPress}
            style={styles.tabItem}>
                {route.name === "Home" && <HomeTabIcon focused={isFocused}/>}
                {route.name === "Settings" && <SettingsTabIcon focused={isFocused}/>}
                {route.name === "Logs" && <LogsTabIcon focused={isFocused}/>}
            </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  focusedTabLevel: {
    color: Colors.white,
  },
  tablevel: {
    fontFamily: Fonts.Medium,
    fontSize: RFValue(10),
    color: Colors.tangled_web,
  },
  pressedTabItem: {
    opacity: 0.7,
  },
  focusedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30.13%',
  },
  tabBarContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    position: 'absolute',
    height: BOTTOM_TAB_HEIGHT,
    paddingTop: 10,
    bottom: 0,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CustomTabBar;
