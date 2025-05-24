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

  const togglePassword = () => {
    setSecureText(!secureText);
  };

  const handleLogin = () => {
    console.log('Login', `Phone: ${phone}\nPassword: ${password}`);
    navigate('UserBottomTab');
  };

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  return (
    <LinearGradient
      colors={
        darkMode
          ? [Colors.BlackFeather, Colors.RoyalNeptune, Colors.Glitch] 
          : [Colors.coral, Colors.white] 
      }
      style={styles.container}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={{width: 90}}></View>
          <Text
            style={[styles.logo, {color: darkMode ? Colors.white : Colors.carbon}]}>
            Welcome
          </Text>
          <Switch
            style={styles.switch}
            value={darkMode}
            onValueChange={() => {
              dispatch(toggleTheme());
            }}
            thumbColor={darkMode ? Colors.vividSkyBlue : Colors.LiquidNitrogen}
            trackColor={{false: Colors.LuckyGrey, true: Colors.ParakeetBlue}}
          />
        </View>

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
            style={[styles.input, {color: darkMode ? Colors.white : Colors.carbon}]}
            placeholder="Phone Number"
            placeholderTextColor={darkMode ? Colors.DhūsarGrey : Colors.LuckyGrey}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: darkMode ? Colors.carbon : Colors.white,
              shadowColor: darkMode ? Colors.white : Colors.black,
            },
          ]}>
          <Icon
            name="lock-outline"
            size={22}
            color={darkMode ? Colors.DhūsarGrey :Colors.coral} 
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, {color: darkMode ? Colors.white : Colors.carbon}]}
            placeholder="Password"
            placeholderTextColor={darkMode ? Colors.DhūsarGrey : Colors.LuckyGrey}
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePassword}>
            <Icon
              name={secureText ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={darkMode ? Colors.DhūsarGrey : Colors.coral}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigate('ForgotPassword')}>
          <Text
            style={[styles.forgotText, {color: darkMode ? Colors.cerebralGrey : Colors.stoneCold}]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            {backgroundColor: darkMode ? Colors.vividSkyBlue : Colors.coral},
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
    marginLeft: 'auto',
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
