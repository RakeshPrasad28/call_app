import {Platform} from 'react-native';

export enum Colors {
  primary = '#fff',
  white = '#fff',
  background = '#000',
  black = '#000',
  text = '#FFFFFF',
  backgroundDark = '#121212',
  backgroundLight = '#1F1F1F',
  inactive = '#B3B3B3',
  tabTextColor='blue',
  stoneCold = '#555',
  argent = '#888',
  carbon = '#333',
  cerebralGrey = '#ccc',
  titaniumWhite = '#e4e4e4',
  doctor = '#F9F9F9',
  nightInManchestor = '#3d4db7',
}
export enum Fonts {
  Regular = 'Satoshi-Regular',
  Medium = 'Satoshi-Medium',
  Light = 'Satoshi-Light',
  Black = 'Satoshi-Black',
  Bold = 'Satoshi-Bold',
}

export const BOTTOM_TAB_HEIGHT = Platform.OS == 'ios' ? 90 : 60;

export const KEY_APP_NAVIGATOR = 'appNavigator';
