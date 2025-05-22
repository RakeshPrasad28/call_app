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
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {navigate} from '../../../utility/NavigationUtils';
import {Colors} from '../../../utility/constants';
import {toggleTheme} from '../../../state/slice/themeSlice';
import {RootState} from '../../../state/store';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const togglePassword = () => {
    setSecureText(!secureText);
  };

  const handleLogin = () => {
    console.log('Login', `Phone: ${phone}\nPassword: ${password}`);
    navigate('UserBottomTab');
  };

  // Get dark mode state and dispatch function
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  return (
    <LinearGradient
      // For dark mode and light mode gradients
      colors={
        darkMode
          ? ['#0f2027', '#203a43', '#2c5364'] // Dark mode gradient
          : ['#00c6ff', '#0072ff', '#00c6ff'] // Cool light mode gradient with blue and teal
      }
      style={[
        styles.container,
        {backgroundColor: darkMode ? '#0f2027' : '#ffffff'},
      ]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={{width:90}}></View>
          <Text
            style={[styles.logo, {color: darkMode ? Colors.white : '#333'}]}>
            Welcome
          </Text>
          <Switch
            style={styles.switch}
            value={darkMode}
            onValueChange={() => {
              dispatch(toggleTheme());
            }}
            thumbColor={darkMode ? '#00c6ff' : '#f4f3f4'}
            trackColor={{false: '#767577', true: '#81b0ff'}}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {backgroundColor: darkMode ? '#ffffff20' : '#f5f5f5'},
          ]}>
          <Icon
            name="phone"
            size={22}
            color={darkMode ? '#aaa' : '#333'}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, {color: darkMode ? Colors.white : '#333'}]}
            placeholder="Phone Number"
            placeholderTextColor={darkMode ? '#aaa' : '#777'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {backgroundColor: darkMode ? '#ffffff20' : '#f5f5f5'},
          ]}>
          <Icon
            name="lock-outline"
            size={22}
            color={darkMode ? '#aaa' : '#333'}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, {color: darkMode ? Colors.white : '#333'}]}
            placeholder="Password"
            placeholderTextColor={darkMode ? '#aaa' : '#777'}
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePassword}>
            <Icon
              name={secureText ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={darkMode ? '#aaa' : '#333'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigate('ForgotPassword')}>
          <Text
            style={[styles.forgotText, {color: darkMode ? '#ccc' : '#555'}]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            {backgroundColor: darkMode ? '#00c6ff' : '#0077b5'},
          ]}
          onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  switch: {
    marginLeft: 'auto', // To align it to the right
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 20,
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
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
