import React, {useState} from 'react';
import {
  ColorValue,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {spacing} from '../../../styles/spacing';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import colors from '../../../styles/colors';
import RegularText from '../text/RegularText';

interface DescInputProps {
  placeHolder?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  refValue?: any;
  value: string;
  error?: string;
  label?: string;
  placeholderTextColor?: ColorValue;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  labelRightComponent?: any;
  borderBottomColor?: ColorValue;
  fieldActiveColor?: ColorValue;
  mainViewStyle?: StyleProp<ViewStyle>;
  //   multiline?: boolean;
  hideCount?: boolean;
}

const DescInput = ({
  placeholderTextColor,
  placeHolder,
  onChangeText = () => { },
  onSubmitEditing = () => { },
  borderBottomColor,
  refValue,
  keyboardType,
  returnKeyType,
  secureTextEntry,
  inputStyle,
  editable,
  value,
  label,
  error = '',
  autoFocus,
  inputContainerStyle,
  labelRightComponent,
  labelStyle,
  maxLength,
  fieldActiveColor,
  mainViewStyle,
  hideCount,
}: //   multiline,
  DescInputProps) => {
  const [isFieldActive, setIsFieldActive] = useState(false);
  const [isUserOnInput, setIsUserOnInput] = useState(false);

  function _handleFocus() {
    if (!isUserOnInput) {
      setIsUserOnInput(true);
    }
    if (!isFieldActive) {
      setIsFieldActive(true);
    }
  }

  function _handleBlur() {
    if (isUserOnInput) {
      setIsUserOnInput(false);
    }
    if (isFieldActive) {
      setIsFieldActive(false);
    }
  }
  return (
    <View
      style={[
        styles.mainView,
        {
          borderBottomColor:
            borderBottomColor != undefined ? borderBottomColor : colors.WHITE,
        },
        mainViewStyle,
      ]}>
      {label && (
        <View style={styles.labelContainer}>
          <RegularText style={[styles.labelStyle, labelStyle]}>
            {label}
          </RegularText>
          {labelRightComponent ? labelRightComponent : null}
        </View>
      )}
      <View
        style={[
          styles.inputView,
          inputContainerStyle,
          {
            borderColor: isFieldActive
              ? fieldActiveColor || colors.BLACK
              : colors.GREY_300,
          },
          error != '' && {borderColor: colors.RED_500},
          editable == false && {
            backgroundColor: colors.GREY_200,
            borderWidth: 0,
          },
        ]}>
        <RNTextInput
          placeholder={placeHolder}
          placeholderTextColor={
            placeholderTextColor != undefined
              ? placeholderTextColor
              : colors.GREY_500
          }
          style={[styles.textInputStyle, inputStyle]}
          ref={refValue}
          onSubmitEditing={() => onSubmitEditing()}
          onChangeText={value => onChangeText(value)}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          editable={editable != undefined ? editable : true}
          value={value}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onFocus={() => _handleFocus()}
          onBlur={() => _handleBlur()}
          multiline={true}
        />
        {value && !hideCount ? (
          <RegularText style={styles.textCounter}>
            {value.length}/{maxLength}
          </RegularText>
        ) : null}
      </View>
      <RegularText style={styles.errorStyle}>{error || ''}</RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {},
  inputView: {
    backgroundColor: colors.WHITE,
    borderRadius: spacing.RADIUS_8,
    paddingHorizontal: spacing.PADDING_8,
    height: spacing.HEIGHT_100,
    borderWidth: spacing.WIDTH_1,
  },
  textInputStyle: {
    color: colors.GREY_900,
    // backgroundColor: 'red',
    flex: 1,
    fontFamily: FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    textAlignVertical: 'top',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.MARGIN_8,
  },
  labelStyle: {
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    color: colors.GREY_800,
    marginLeft: spacing.MARGIN_4,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
  },
  errorStyle: {
    fontSize: FONT_SIZE.NORMAL,
    color: colors.RED_500,
    marginTop: spacing.MARGIN_2,
    marginLeft: spacing.MARGIN_4,
  },
  textCounter: {
    alignSelf: 'flex-end',
    color: colors.GREY_700,
  },
});

export default DescInput;
