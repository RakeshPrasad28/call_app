import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {navigate} from '../../../utility/NavigationUtils';
import {Colors} from '../../../utility/constants';
import {toggleTheme} from '../../../state/slice/themeSlice';
import {RootState} from '../../../state/store';
import LinearGradient from 'react-native-linear-gradient'; 


const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  const togglePassword = () => setSecureText(!secureText);
  const handleLogin = () => {
    console.log('Login', `Phone: ${phone}\nPassword: ${password}`);
    navigate('UserBottomTab');
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

      <View style={styles.themeToggleContainer}>
        <Switch
          value={darkMode}
          onValueChange={() => dispatch(toggleTheme())}
          thumbColor={darkMode ? Colors.vividSkyBlue : '#fff'}
          trackColor={{false: '#ccc', true: Colors.ParakeetBlue}}
        />
      </View>

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
            style={[styles.logo, {color: darkMode ? Colors.white : '#333'}]}>
            Login
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: darkMode ? Colors.carbon : '#fff',
                borderColor: darkMode ? Colors.DhūsarGrey : '#ddd',
              },
            ]}>
            <Icon
              name="phone"
              size={22}
              color={darkMode ? Colors.DhūsarGrey : '#FF6B6B'}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {color: darkMode ? Colors.white : '#222'}]}
              placeholder="Phone Number"
              placeholderTextColor={darkMode ? Colors.DhūsarGrey : '#999'}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: darkMode ? Colors.carbon : '#fff',
                borderColor: darkMode ? Colors.DhūsarGrey : '#ddd',
              },
            ]}>
            <Icon
              name="lock-outline"
              size={22}
              color={darkMode ? Colors.DhūsarGrey : '#FF6B6B'}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {color: darkMode ? Colors.white : '#222'}]}
              placeholder="Password"
              placeholderTextColor={darkMode ? Colors.DhūsarGrey : '#999'}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePassword}>
              <Icon
                name={secureText ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={darkMode ? Colors.DhūsarGrey : '#999'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => navigate('ForgotPassword')}>
            <Text
              style={[
                styles.forgotText,
                {color: darkMode ? Colors.cerebralGrey : '#0066cc'},
              ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: darkMode ? Colors.vividSkyBlue : '#FF6B6B',
              },
            ]}
            onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
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
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
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
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
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
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

