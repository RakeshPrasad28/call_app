import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import RegularText from '../text/RegularText';
import colors from '../../../styles/colors';

interface TitleValueViewProps {
  title: string;
  value?: string;
  titleStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  mainViewStyle?: StyleProp<ViewStyle>;
  valueComponent?: any;
}

const TitleValueView = ({
  title,
  value,
  titleStyle,
  valueStyle,
  mainViewStyle,
  valueComponent,
}: TitleValueViewProps) => {
  return (
    <View style={[styles.container, mainViewStyle]}>
      <RegularText style={[styles.titleStyle, {flex: 1}, titleStyle]}>
        {title}
      </RegularText>
      {valueComponent ? (
        valueComponent
      ) : (
        <RegularText style={[styles.valueStyle, valueStyle]}>
          {value}
        </RegularText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  titleStyle: {
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    textTransform: 'capitalize',
    color: colors.BLACK,
    fontFamily: FONT_FAMILY.PRIMARY_SEMI_BOLD,
  },
  valueStyle: {
    flex: 1,
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    color: colors.GREY_600,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
  },
});

export default TitleValueView;
