import React, {useEffect, useState} from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import {spacing} from '../../../styles/spacing';
import {FONT_FAMILY, FONT_SIZE} from '../../../styles/typography';
import RegularText from '../text/RegularText';
import colors from '../../../styles/colors';

interface OtpInputProps {
  borderBottomColor?: ColorValue;
  error?: string;
  otpLength?: number;
  onCodeChange: (text: any) => void;
  onCodeFilled?: () => void;
  code: string;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  mainViewStyle?: StyleProp<ViewProps>;
  autoFocus?: boolean;
}

const OtpInput = ({
  borderBottomColor,
  error,
  otpLength = 6,
  onCodeChange,
  code,
  label,
  labelStyle,
  mainViewStyle,
  autoFocus,
}: OtpInputProps) => {
  // const OTP_BOX_SIZE = (spacing.FULL_WIDTH - (APP_PADDING_HORIZONTAL * 2) - (spacing.MARGIN_20 * otpLength)) / otpLength
  const OTP_BOX_SIZE = spacing.WIDTH_62;
  const [otpCountArray, setOtpCountArray] = useState<any>([]);

  useEffect(() => {
    if (otpCountArray.length === 0 || otpCountArray.length != otpLength) {
      let tempArr = [];
      for (let i = 1; i <= (otpLength || 6); i++) {
        tempArr.push(i);
      }
      setOtpCountArray(tempArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpLength]);

  function onSubmitEditing() { }
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
      {label && label != '' && (
        <RegularText style={[styles.labelStyle, labelStyle]}>
          {label}
        </RegularText>
      )}

      <View style={styles.fieldBoxContainer}>
        {otpCountArray.map((item: any, index: number) => (
          <View
            key={index}
            style={[
              styles.otpEmptyField,
              {
                width: OTP_BOX_SIZE,
                height: OTP_BOX_SIZE * 1.1,
              },
              code.length > index && styles.otpFilledField,
            ]}>
            <RegularText
              style={{
                ...styles.otp,
                color: code.length > index ? colors.GREY_900 : colors.GREY_400,
              }}>
              {code.length > index ? code[index] : ''}
            </RegularText>
          </View>
        ))}
      </View>
      <TextInput
        autoFocus={autoFocus || true}
        onSubmitEditing={onSubmitEditing}
        style={[
          styles.inputStyle,
          {
            height: OTP_BOX_SIZE,
            width: OTP_BOX_SIZE * otpLength + spacing.MARGIN_8 * otpLength * 2,
          },
        ]}
        maxLength={otpLength}
        keyboardType={'numeric'}
        // placeholderTextColor="#212121"
        onChangeText={onCodeChange}
        value={code}
        cursorColor={colors.TRANSPARENT}
        contextMenuHidden={true}
        caretHidden={true}
      />
      {error != '' && (
        <RegularText style={styles.errorStyle}>{error}</RegularText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginTop: spacing.MARGIN_24,
  },
  labelStyle: {
    fontSize: FONT_SIZE.SEMI_MEDIUM,
    fontFamily: FONT_FAMILY.PRIMARY_SEMI_BOLD,
    marginBottom: spacing.MARGIN_20,
  },
  codeInputFieldStyle: {
    width: spacing.HEIGHT_50,
    height: spacing.HEIGHT_50,
    borderWidth: spacing.WIDTH_1,
    borderRadius: spacing.RADIUS_8,
    borderColor: colors.GREY_400,
    color: colors.BLACK,
    fontSize: FONT_SIZE.TITLE,
    fontFamily: FONT_FAMILY.PRIMARY_REGULAR,
  },
  codeInputHighlightStyle: {
    borderColor: colors.BLACK,
  },
  fieldBoxContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  otpEmptyField: {
    marginHorizontal: spacing.MARGIN_8,
    borderColor: colors.GREY_300,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: spacing.RADIUS_1,
    borderRadius: spacing.RADIUS_6,
    backgroundColor: colors.APP_BACKGROUND,
  },
  otpFilledField: {
    borderColor: colors.GREY_800,
  },
  otp: {
    fontSize: FONT_SIZE.LARGE,
    fontFamily: FONT_FAMILY.PRIMARY_MEDIUM,
  },
  inputStyle: {
    position: 'absolute',
    alignSelf: 'center',
    color: colors.TRANSPARENT,
    borderColor: colors.RED_200,
  },
  errorStyle: {},
});

export default OtpInput;
