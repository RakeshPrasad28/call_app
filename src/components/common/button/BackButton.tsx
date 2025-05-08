import React from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {spacing} from '../../../styles/spacing';
import {FONT_SIZE} from '../../../styles/typography';
import {goBack} from '../../../utility/commonFunction';
import RegularText from '../text/RegularText';
import colors from '../../../styles/colors';
import Image from '../../Image';
import {Images} from '../../../utility/imagePaths';

interface BackButtonProps {
  mainContainerStyle?: StyleProp<ViewStyle>;
  text?: string;
  onBack?: () => void;
  arrowStyle?: StyleProp<ViewStyle>;
  backArrowTintColor?: ColorValue;
  textStyle?: StyleProp<TextStyle>;
}

const BackButton = ({
  mainContainerStyle,
  text,
  onBack,
  arrowStyle,
  backArrowTintColor,
  textStyle,
}: BackButtonProps) => {
  function onPressBack() {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  }

  return (
    <TouchableOpacity
      style={[styles.mainContainer, mainContainerStyle]}
      onPress={() => onPressBack()}>
      <Image
        source={Images.IMG_ARROW_FORWARD}
        style={[
          styles.iconStyle,
          arrowStyle as any,
          {tintColor: backArrowTintColor ? backArrowTintColor : ''},
        ]}
      />
      <RegularText
        style={[
          styles.text,
          {color: backArrowTintColor ? backArrowTintColor : colors.GREY_900},
          textStyle,
        ]}>
        {text ? text : 'Back'}
      </RegularText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    transform: [{rotate: '180deg'}],
  },
  text: {
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    marginLeft: spacing.MARGIN_6,
  },
});

export default BackButton;
