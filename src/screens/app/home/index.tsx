import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import CallLogScreen from '../../../components/CallLogScreen';

const Home = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* <Text style={{fontSize: 20, marginBottom: 20}}>
        📲 Call Detection App
      </Text> */}
      <CallLogScreen />
    </View>
  );
};

export default Home;
