import React, { useEffect } from 'react'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/Navigation/Navigation';
import { PermissionsAndroid, Text, View } from 'react-native';
import {Provider} from 'react-redux';
import { store } from './src/state/store';

const App = () => {

  useEffect(() => {
    requestCallLogPermission();
  }, []);

  const requestCallLogPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Permission',
          message: 'This app needs access to your call history.',
          buttonPositive: 'OK',
        },
      );
      console.log('granted >>', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // getCallHistory();
        console.log("permission granted")
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  )
}

export default App