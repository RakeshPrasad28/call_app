import React, {useState} from 'react';
import {
  ColorValue,
  Keyboard,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import commonStyle from '../../../styles/globalStyles';
import {spacing} from '../../../styles/spacing';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import colors from '../../../styles/colors';
import RegularText from '../text/RegularText';

interface TextInputProps {
  placeHolder?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onPressInput?: () => void;
  refValue?: any;
  value: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  label?: string;
  activeOutlineColor?: string;
  placeholderTextColor?: ColorValue;
  fieldActiveColor?: ColorValue;
  inactiveOutlineColor?: string;
  keyboardType?: KeyboardTypeOptions;
  maxChar?: number;
  editable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  mainViewStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  returnKeyType?: ReturnKeyTypeOptions;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  multiline?: boolean;
  rightComponent?: any;
  leftComponent?: any;
  labelRightComponent?: any;
  labelContainerStyle?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  isErrorPossible?: boolean;
}

const TextInput = ({
  placeHolder,
  onChangeText = () => { },
  onSubmitEditing = () => { },
  refValue,
  keyboardType,
  returnKeyType,
  secureTextEntry,
  inputStyle,
  editable,
  value,
  error,
  rightComponent,
  leftComponent,
  onPressInput,
  mainViewStyle,
  autoCapitalize,
  maxChar,
  multiline,
  inputContainerStyle,
  autoFocus,
  label,
  labelRightComponent,
  labelStyle,
  fieldActiveColor,
  labelContainerStyle,
  onFocus,
  onBlur,
  isErrorPossible,
}: TextInputProps) => {
  const [isFieldActive, setIsFieldActive] = useState(false);

  function _handleFocus() {
    if (!isFieldActive) {
      setIsFieldActive(true);
      if (onFocus) onFocus();
    }
  }

  function _handleBlur() {
    if (isFieldActive) {
      setIsFieldActive(false);
      if (onBlur) onBlur();
    }
  }

  return (
    <View style={[mainViewStyle, {}]}>
      {label && (
        <View style={[styles.labelContainer, labelContainerStyle]}>
          <RegularText style={[styles.labelStyle, labelStyle]}>
            {label}
          </RegularText>
          {labelRightComponent ? labelRightComponent : null}
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFieldActive
              ? fieldActiveColor || colors.BLACK
              : colors.GREY_300,
          },
          error != undefined && error != '' && {borderColor: colors.RED_500},
          editable == false && {
            backgroundColor: colors.GREY_200,
            borderColor: colors.TRANSPARENT,
          },
          inputContainerStyle,
        ]}>
        {leftComponent ? leftComponent : null}
        <RNTextInput
          ref={refValue}
          placeholder={placeHolder ? placeHolder : ''}
          placeholderTextColor={colors.GREY_500}
          value={value}
          editable={editable != undefined ? editable : true}
          multiline={multiline != undefined ? multiline : false}
          showSoftInputOnFocus={onPressInput ? false : true}
          style={[styles.textInputStyle, inputStyle, {}]}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize || 'sentences'}
          autoFocus={autoFocus || false}
          maxLength={maxChar ? maxChar : undefined}
          onFocus={() => _handleFocus()}
          onBlur={() => _handleBlur()}
          onPressIn={() => {
            if (onPressInput) {
              Keyboard.dismiss();
              onPressInput();
            }
          }}
          onSubmitEditing={() => onSubmitEditing()}
          onChangeText={value => onChangeText(value)}
        />
        {rightComponent ? rightComponent : null}
      </View>
      {isErrorPossible != true && (
        <RegularText style={commonStyle.inputFieldError}>
          {error || ''}
        </RegularText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {},
  inputContainer: {
    height: spacing.HEIGHT_52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.RADIUS_8,
    backgroundColor: colors.WHITE,
    borderWidth: spacing.WIDTH_1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.MARGIN_4,
  },
  labelStyle: {
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
  },
  textInputStyle: {
    flex: 1,
    color: colors.BLACK,
    zIndex: 1,
    fontFamily: FONT_FAMILY.PRIMARY_REGULAR,
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    paddingHorizontal: spacing.PADDING_12,
  },
});

export default TextInput;
