import React from 'react';
import {ScrollView, StyleProp, ViewStyle} from 'react-native';

type AppContentProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const AppContent = ({style, children}: AppContentProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={10}
      bounces={false}
      overScrollMode="never"
      scrollEnabled={true}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps={'handled'}
      style={style}>
      {children}
    </ScrollView>
  );
};

export default AppContent;
