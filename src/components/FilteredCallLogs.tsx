import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import Icon from './common/Icon';
import {goBack, navigate} from '../utility/NavigationUtils';
import {Avatar} from '@rneui/themed';
import {Colors} from '../utility/constants';
import {getFilteredCallLogs} from '../database/RealmService';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootState} from '../state/store';
import {useSelector} from 'react-redux';

interface ICallLog {
  phoneNumber: string;
  timestamp: number;
  dateTime: string;
  type: string;
  duration: number;
  name?: string;
  createdAt?: Date;
  id?: string;
  feedback?: string | null;
}

const FilteredCallLogs = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {type = 'ALL'} = route.params || {};
  const [filteredLogs, setFilteredLogs] = useState<ICallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
  setIsLoading(true);
  const logs = getFilteredCallLogs(type);
  setFilteredLogs(logs);
  setIsLoading(false);
}, [type]);

  const formatDate = (timestamp: number) => {
    const date = moment(timestamp);
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) {
      return date.format('hh:mm A');
    } else if (date.isSame(yesterday, 'day')) {
      return `Yesterday ${date.format('hh:mm A')}`;
    }
    return date.format('DD-MMM-YYYY hh:mm A');
  };

  const formatTime = (seconds: number): string => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${String(minutes).padStart(2, '0')}:${String(
        seconds % 60,
      ).padStart(2, '0')}`;
    }

    return `${seconds}s`;
  };

  const renderItem = ({item}: {item: ICallLog}) => {
    return (
      <TouchableOpacity
        style={[
          styles.callLogContainer,
          {
            backgroundColor: darkMode ? '#2C2C2C' : Colors.white,
            shadowColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : Colors.black,
          },
        ]}
        onPress={() =>
          navigate('PersonCallLogs', {
            item: {
              ...item,
              createdAt: item?.createdAt?.toISOString(),
            },
          })
        }>
        <View style={styles.callLogInfo}>
          {item.type === 'MISSED' && (
            <Icon
              name="call-missed"
              iconFamily="MaterialIcons"
              color="red"
              size={RFValue(18)}
            />
          )}
          {['INCOMING', 'UNKNOWN'].includes(item.type) && (
            <Icon
              name="arrow-bottom-left"
              iconFamily="MaterialCommunityIcons"
              color="green"
              size={RFValue(18)}
            />
          )}
          {item.type === 'OUTGOING' && (
            <Icon
              name="arrow-top-right"
              iconFamily="MaterialCommunityIcons"
              color="blue"
              size={RFValue(18)}
            />
          )}

          <View style={styles.callLogText}>
            <Text style={[styles.phoneText, {color: darkMode ? Colors.white : Colors.black}]}>
              {item.name || item.phoneNumber}
            </Text>
            <Text style={[styles.dateText,{color: darkMode ? Colors.white : Colors.black}]}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
        <Text style={[styles.durationText, {color: darkMode ? Colors.white : Colors.black}]}>
          {item.duration ? formatTime(item.duration) : null}
        </Text>
      </TouchableOpacity>
    );
  };

  const getTitle = () => {
    switch (type) {
      case 'INCOMING':
        return 'Incoming Calls';
      case 'OUTGOING':
        return 'Outgoing Calls';
      case 'MISSED':
        return 'Missed Calls';
      default:
        return 'All Calls';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? 0 : insets.top},
        {backgroundColor: darkMode ? Colors.black : '#f5f5f5'},
      ]}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Icon
            name="arrow-back-sharp"
            iconFamily="Ionicons"
            size={RFValue(24)}
            color={darkMode ? Colors.white : Colors.black}
          />
        </Pressable>
        <Text
          style={[
            styles.titleText,
            {color: darkMode ? Colors.white : Colors.black},
          ]}>
          {getTitle()}
        </Text>
      </View>

      <FlatList
        data={filteredLogs}
        renderItem={renderItem}
        keyExtractor={item => `${item.phoneNumber}_${item.timestamp}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.doctor,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    marginRight: 15,
  },
  titleText: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: Colors.carbon,
  },
  callLogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callLogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  callLogText: {
    flex: 1,
  },
  phoneText: {
    fontSize: RFValue(16),
    color: Colors.carbon,
    fontWeight: '500',
  },
  dateText: {
    fontSize: RFValue(12),
    color: Colors.argent,
    marginTop: 2,
  },
  durationText: {
    fontSize: RFValue(14),
    color: Colors.carbon,
    fontWeight: '500',
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default FilteredCallLogs;
