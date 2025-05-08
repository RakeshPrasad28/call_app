import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import CallLogs from 'react-native-call-log';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCallLogs,
  appendCallLogs,
  setMinTimestamp,
} from '../state/slice/callLogSlice';
import {RootState} from '../state/store';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import {navigate} from '../utility/NavigationUtils';
import Icon from './common/Icon';
import {Avatar} from '@rneui/themed';
import Search from './Search';
import { Colors } from '../utility/constants';

const CallLogScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {callLogs, selectedFilter, minTimestamp} = useSelector(
    (state: RootState) => state.callLogs,
  );

  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const formatDate = (dateTime: string) => {
    const date = moment(dateTime, 'DD-MMM-YYYY hh:mm:ss a');
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) return date.format('h:mm A');
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    return date.format('DD-MMM-YYYY');
  };

  //  Fetch latest 20 logs (used for initial load & refresh)
  const fetchInitialLogs = async () => {
    try {
      setIsFetching(true);
      const logs = await CallLogs.load(20); // no filter
      const filteredLogs = logs.filter((log: any) =>
        selectedFilter === 'ALL' ? true : log.type === selectedFilter,
      );

      dispatch(setCallLogs(filteredLogs));
      if (logs.length > 0) {
        const newMin = Math.min(...logs.map((log: any) => log.timestamp));
        dispatch(setMinTimestamp(newMin));
      }
    } catch (err) {
      console.error('Error fetching initial logs:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMoreLogs = async () => {
    if (isFetching || minTimestamp === null) return;
    try {
      setIsFetching(true);
      const logs = await CallLogs.load(20, {maxTimestamp: minTimestamp - 1});
      const filteredLogs = logs.filter((log: any) =>
        selectedFilter === 'ALL' ? true : log.type === selectedFilter,
      );

      dispatch(appendCallLogs(filteredLogs));
      if (logs.length > 0) {
        const newMin = Math.min(...logs.map((log: any) => log.timestamp));
        dispatch(setMinTimestamp(newMin));
      }
    } catch (err) {
      console.error('Error fetching more logs:', err);
    } finally {
      setIsFetching(false);
    }
  };

  //  Pull-to-refresh
  const refreshCallLogs = async () => {
    setRefreshing(true);
    dispatch(setCallLogs([]));
    dispatch(setMinTimestamp(null));
    await fetchInitialLogs();
    setRefreshing(false);
  };

  useEffect(() => {
    refreshCallLogs();
  }, [selectedFilter]);

  const handleEndReached = () => {
    if (!isFetching) fetchMoreLogs();
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => navigate('PersonCallLogs', {item})}
      style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <View style={styles.iconContainer}>
          {item?.name ? (
            <Avatar
              size={50}
              rounded
              title={item?.name?.[0]}
              containerStyle={{backgroundColor: Colors.nightInManchestor}}
            />
          ) : (
            <Icon
              name="person"
              iconFamily="Ionicons"
              color={Colors.nightInManchestor}
              size={RFValue(24)}
            />
          )}
        </View>
        <View>
          <Text style={{fontSize: RFValue(18)}}>
            {item.name || item.phoneNumber}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            {item.type === 'MISSED' && (
              <Icon
                name="call-missed"
                iconFamily="MaterialIcons"
                color="red"
                size={RFValue(14)}
              />
            )}
            {item.type === 'INCOMING' && (
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
            )}
            {item.type === 'UNKNOWN' && (
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
            )}
            {item.type === 'OUTGOING' && (
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
            )}
            <Text>{formatDate(item.dateTime)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getKey = (item: any): string => `${item.phoneNumber}_${item.timestamp}`;

  const toggleMenu = useCallback(() => setIsMenuVisible(prev => !prev), []);

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Search onToggleMenu={toggleMenu} />
      {isMenuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={styles.overlay}>
          <View style={styles.modalPosition}>
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'INCOMING'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Incoming Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'OUTGOING'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Outgoing Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                navigate('FilteredCallLogs', {type: 'MISSED'});
              }}
              style={styles.modalContainer}>
              <Icon
                name="call-missed"
                iconFamily="MaterialIcons"
                color="red"
                size={RFValue(14)}
              />
              <Text style={styles.modalText}>Missed Calls</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {isFetching && callLogs.length === 0 && (
        <ActivityIndicator size="large" />
      )}

      <FlatList
        data={callLogs}
        renderItem={renderItem}
        keyExtractor={getKey}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        onRefresh={refreshCallLogs}
        refreshing={refreshing}
        ListFooterComponent={
          isFetching && callLogs.length > 0 ? (
            <Text>Loading more...</Text>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalPosition: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  modalText: {
    fontSize: RFValue(18),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 9,
    pointerEvents: 'box-none',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: Colors.nightInManchestor,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default CallLogScreen;
