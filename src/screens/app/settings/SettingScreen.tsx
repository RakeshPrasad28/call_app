import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {toggleTheme} from '../../../state/slice/themeSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../state/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {resetAndNavigate} from '../../../utility/NavigationUtils';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import { Colors } from '../../../utility/constants';

type RootStackParamList = {
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const SettingScreen = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState(
    'https://randomuser.me/api/portraits/men/1.jpg',
  );

  const handleLogout = () => {
    resetAndNavigate('Login');
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const selectImage = async (source: 'gallery' | 'camera') => {
    try {
      if (source === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;
      } else {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;
      }

      const options = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      };

      const result =
        source === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setProfileImage(uri);
        }
      }
    } catch (error) {
      console.log('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => selectImage('camera'),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => selectImage('gallery'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: darkMode ? '#121212' : '#f0f0f0'},
        {paddingTop: Platform.OS === 'ios' ? 0 : insets.top},
      ]}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={showImagePickerOptions} activeOpacity={0.7}>
          <View
            style={[
              styles.profileImageContainer,
              {borderColor: darkMode ? Colors.button_blue : Colors.carbon},
            ]}>
            <Image source={{uri: profileImage}} style={styles.profileImage} />
            <View style={styles.editIcon}>
              <Icon name="camera" size={20} color={Colors.white} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[styles.profileName, {color: darkMode ? Colors.white : Colors.black}]}>
          Rakesh
        </Text>
        <Text
          style={[styles.profileEmail, {color: darkMode ? '#aaa' : '#666'}]}>
          rakesh@yahoo.com
        </Text>
      </View>

      <View
        style={[styles.card, {backgroundColor: darkMode ? '#2C2C2C' : Colors.white}]}>
        <View style={styles.row}>
          <Icon
            name="theme-light-dark"
            size={24}
            color={darkMode ? Colors.white : Colors.carbon}
          />
          <Text style={[styles.text, {color: darkMode ? Colors.white : Colors.black}]}>
            Dark Mode
          </Text>
          <Switch
            style={{marginLeft: 'auto'}}
            value={darkMode}
            onValueChange={() => {
              dispatch(toggleTheme());
            }}
            thumbColor={darkMode ? '#00c6ff' : '#f4f3f4'}
            trackColor={{false: '#767577', true: '#81b0ff'}}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={Colors.white} style={{marginRight: 8}} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    marginTop: 40,
    backgroundColor: '#00c6ff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#00c6ff',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#00c6ff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
  },
});
