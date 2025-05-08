import React, {useState} from 'react';
import {
  ActivityIndicator,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {APP_PADDING_HORIZONTAL} from '../../../styles/globalStyles';
import {spacing} from '../../../styles/spacing';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import colors from '../../../styles/colors';
import RegularText from '../text/RegularText';
import Image from '../../Image';

interface FabButtonProps {
  onPressButton?: () => void;
  title?: string;
  testID?: string;
  titleStyle?: StyleProp<TextStyle>;
  leftImage?: any;
  leftImageStyle?: StyleProp<ImageStyle>;
  rightImage?: any;
  disabled?: boolean;
  rightImageStyle?: StyleProp<ImageStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  overlay?: boolean;
}

const FabButton = ({
  onPressButton = () => { },
  title,
  titleStyle,
  leftImage,
  leftImageStyle,
  rightImage,
  rightImageStyle,
  mainContainerStyle,
  disabled,
  testID,
  loading,
  overlay,
}: FabButtonProps) => {
  const [ishovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      activeOpacity={1}
      onPress={() => onPressButton()}
      disabled={disabled}
      testID={testID}
      style={[
        styles.mainContainer,
        disabled && {opacity: 0.6},
        ishovered && {backgroundColor: colors.LIGHT_THEME_02},
        mainContainerStyle,
      ]}>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.WHITE} />
      ) : (
        <>
          {overlay && (
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: colors.LIGHT_THEME_01,
                },
              ]}
            />
          )}
          {leftImage && <Image source={leftImage} style={leftImageStyle} />}
          {title && (
            <RegularText
              style={[styles.title, titleStyle]}
              numberOfLines={1}
              adjustsFontSizeToFit={true}>
              {title}
            </RegularText>
          )}
          {rightImage && <Image source={rightImage} style={rightImageStyle} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: spacing.MARGIN_30,
    right: APP_PADDING_HORIZONTAL,
    borderRadius: spacing.RADIUS_90,
    // padding: spacing.PADDING_16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: spacing.WIDTH_70,
    minHeight: spacing.WIDTH_70,
    backgroundColor: colors.THEME,
    overflow: 'hidden',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  title: {
    color: colors.WHITE,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
    fontSize: FONT_SIZE.MEDIUM,
    alignSelf: 'center',
  },
});

export default FabButton;
