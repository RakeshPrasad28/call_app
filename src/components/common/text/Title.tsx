import React from 'react';
import {ColorValue, StyleProp, TextStyle} from 'react-native';
import colors from '../../../styles/colors';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import RegularText from './RegularText';

interface TitleProps {
  title: string;
  style?: StyleProp<TextStyle>;
  fontSize?: number;
  fontFamily?: string;
  color?: ColorValue;
}

const Title = ({title, style, fontSize, fontFamily, color}: TitleProps) => {
  return (
    <RegularText
      style={[
        {
          fontSize: fontSize || FONT_SIZE.TITLE,
          fontFamily: fontFamily || FONT_FAMILY.PRIMARY_MEDIUM,
          color: color || colors.GREY_900,
        },
        style,
      ]}>{title}</RegularText>
  );
};

export default Title;
