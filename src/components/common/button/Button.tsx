import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../../styles/colors';
import {spacing} from '../../../styles/spacing';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import Image from '../../Image';
import RegularText from '../text/RegularText';

interface ButtonProps {
  backgroundColor?: ColorValue;
  title: string;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  onPressButton: () => void;
  disabled?: boolean;
  fetching?: boolean;
  rightImage?: any;
  rightImageStyle?: StyleProp<ImageStyle>;

  leftImage?: any;
  leftImageStyle?: StyleProp<ImageStyle>;
  activityIndicatorColor?: ColorValue;
  isSecondary?: boolean;
  testID?: string;
}

const Button = ({
  backgroundColor,
  title,
  textStyle,
  buttonStyle,
  onPressButton,
  disabled,
  fetching,
  rightImage,
  rightImageStyle,
  leftImage,
  leftImageStyle,
  activityIndicatorColor,
  isSecondary,
  testID,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonStyle,
        {
          backgroundColor: isSecondary
            ? backgroundColor || colors.WHITE
            : backgroundColor || colors.THEME,

          borderColor: backgroundColor || colors.THEME,
        },
        disabled && {
          backgroundColor: colors.LIGHT_THEME_02,
          borderColor: colors.LIGHT_THEME_02,
        },
        // isSecondary && { backgroundColor : colors}
        buttonStyle,
      ]}
      onPress={() => {
        if (!fetching) {
          onPressButton();
        }
      }}
      testID={testID}>
      {!fetching && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {leftImage ? (
            <View style={{alignItems: 'flex-end'}}>
              <Image source={leftImage} style={leftImageStyle} />
            </View>
          ) : null}
          <RegularText
            style={[
              styles.textStyle,
              isSecondary && {color: colors.THEME},
              textStyle,
            ]}>
            {title}
          </RegularText>
          {rightImage ? (
            <View style={{alignItems: 'flex-end'}}>
              <Image source={rightImage} style={rightImageStyle} />
            </View>
          ) : null}
        </View>
      )}
      {fetching == true && (
        <ActivityIndicator
          color={activityIndicatorColor || colors.WHITE}
          size="small"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: spacing.RADIUS_8,
    paddingHorizontal: spacing.PADDING_12,
    height: spacing.HEIGHT_48,
    justifyContent: 'center',
    borderWidth: spacing.WIDTH_2,
  },
  textStyle: {
    color: colors.WHITE,
    fontSize: FONT_SIZE.MEDIUM,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
  },
});

export default Button;
