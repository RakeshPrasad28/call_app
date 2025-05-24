import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {goBack} from '../../../utility/NavigationUtils';
import {Colors} from '../../../utility/constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../state/store';

const ForgotPasswordScreen = () => {
  const [phone, setPhone] = useState('');
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }
    Alert.alert('OTP Sent', `An OTP has been sent to ${phone}`);
  };

  return (
    <LinearGradient
      colors={
        darkMode
          ? [Colors.BlackFeather, Colors.RoyalNeptune, Colors.Glitch]
          : [Colors.coral, Colors.white]
      }
      style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.innerContainer}>
        <Text
          style={[
            styles.title,
            {color: darkMode ? Colors.white : Colors.carbon},
          ]}>
          Forgot Password
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: darkMode ? Colors.cerebralGrey : Colors.stoneCold},
          ]}>
          Enter your phone number to receive an OTP
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: darkMode ? Colors.carbon : Colors.white,
              shadowColor: darkMode ? Colors.white : Colors.black,
            },
          ]}>
          <Icon
            name="phone"
            size={22}
            color={darkMode ? Colors.DhūsarGrey : Colors.coral}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={
              darkMode ? Colors.DhūsarGrey : Colors.LuckyGrey
            }
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.otpButton,
            {backgroundColor: darkMode ? Colors.vividSkyBlue : Colors.coral},
          ]}
          onPress={handleSendOtp}>
          <Text style={styles.otpText}>Send OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLogin} onPress={() => goBack()}>
          <Text
            style={[
              styles.backText,
              {color: darkMode ? Colors.cerebralGrey : Colors.stoneCold},
            ]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  otpButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  otpText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: 30,
  },
  backText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
