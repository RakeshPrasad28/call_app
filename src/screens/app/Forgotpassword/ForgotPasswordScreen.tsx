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
          : ['#e0e5ec', '#f2f6fc']
      }
      style={styles.container}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.contentBox,
            {
              backgroundColor: darkMode ? Colors.carbon : 'rgba(255, 255, 255, 0.9)',
              shadowColor: darkMode ? 'transparent' : '#000',
            },
          ]}>
          <Text
            style={[styles.title, {color: darkMode ? Colors.white : Colors.carbon}]}>
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
                borderColor: darkMode ? Colors.DhūsarGrey : Colors.steam,
              },
            ]}>
            <Icon
              name="phone"
              size={22}
              color={darkMode ? Colors.DhūsarGrey : Colors.pompelmo}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {color: darkMode ? Colors.white : Colors.black_out}]}
              placeholder="Phone Number"
              placeholderTextColor={darkMode ? Colors.DhūsarGrey : Colors.million_grey}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.otpButton,
              {
                backgroundColor: darkMode ? Colors.vividSkyBlue : Colors.pompelmo,
              },
            ]}
            onPress={handleSendOtp}>
            <Text style={styles.otpText}>Send OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToLogin} onPress={goBack}>
            <Text
              style={[
                styles.backText,
                {color: darkMode ? Colors.cerebralGrey : Colors.royal_navy_blue},
              ]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentBox: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  otpButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
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
