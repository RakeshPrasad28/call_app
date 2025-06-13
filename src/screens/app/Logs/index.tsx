import React, {useEffect, useState} from 'react';
import {StatusBar, Text, View} from 'react-native';
import CallLogScreen from '../../../components/CallLogScreen';
import {Colors} from '../../../utility/constants';

const Logs = () => {
  
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <CallLogScreen />
    </View>
  );
};

export default Logs;
