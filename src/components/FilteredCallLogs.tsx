import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import Icon from './common/Icon';
import {goBack} from '../utility/NavigationUtils';
import {Avatar} from '@rneui/themed';
import {Colors} from '../utility/constants';
import CallLogDatabase from '../database/CallLogDatabase';

interface ICallLog {
  phoneNumber: string;
  timestamp: number;
  dateTime: string;
  type: string;
  duration: number;
  name?: string;
}

const FilteredCallLogs = () => {
  const route = useRoute();
  const {type = 'ALL'} = route.params || {};
  const [filteredLogs, setFilteredLogs] = useState<ICallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFilteredCallLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const realm = await CallLogDatabase.initialize();
      let results;
      
      if (type === 'ALL') {
        results = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);
      } else {
        results = realm.objects<ICallLog>('CallLog')
          .filtered('type == $0', type)
          .sorted('timestamp', true);
      }

      setFilteredLogs(Array.from(results));
    } catch (error) {
      console.error('Error loading filtered logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadFilteredCallLogs();
  }, [loadFilteredCallLogs]);

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
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }

    return `${seconds}s`;
  };

  const renderItem = ({item}: {item: ICallLog}) => {
    return (
      <View style={styles.callLogContainer}>
        <View style={styles.callLogInfo}>
          {item.type === 'MISSED' && (
            <Icon name="call-missed" iconFamily="MaterialIcons" color="red" size={RFValue(18)} />
          )}
          {['INCOMING', 'UNKNOWN'].includes(item.type) && (
            <Icon name="arrow-bottom-left" iconFamily="MaterialCommunityIcons" color="green" size={RFValue(18)} />
          )}
          {item.type === 'OUTGOING' && (
            <Icon name="arrow-top-right" iconFamily="MaterialCommunityIcons" color="blue" size={RFValue(18)} />
          )}
          
          <View style={styles.callLogText}>
            <Text style={styles.phoneText}>{item.name || item.phoneNumber}</Text>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
        <Text style={styles.durationText}>
          {item.duration ? formatTime(item.duration) : null}
        </Text>
      </View>
    );
  };

  const getTitle = () => {
    switch (type) {
      case 'INCOMING': return 'Incoming Calls';
      case 'OUTGOING': return 'Outgoing Calls';
      case 'MISSED': return 'Missed Calls';
      default: return 'All Calls';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-back-sharp" iconFamily="Ionicons" size={RFValue(24)} color={Colors.black} />
        </Pressable>
        {/* <Text style={styles.titleText}>{getTitle()} ({filteredLogs.length})</Text> */}
        <Text style={styles.titleText}>{getTitle()}</Text>
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
    marginBottom: 20,
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