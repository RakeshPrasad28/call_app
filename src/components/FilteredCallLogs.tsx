import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, FlatList, Pressable, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import {Avatar} from '@rneui/themed';

import {useCallLogs} from '../hooks/useCallLogs';
import Icon from './common/Icon';
import {goBack} from '../utility/NavigationUtils';

const FilteredCallLogs = () => {
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
const [filteredOffset, setFilteredOffset] = useState(0);
const [filteredHasMore, setFilteredHasMore] = useState(true);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const { getFilteredLogsPaginated } = useCallLogs('ALL');


  const route = useRoute();
  const {type = 'ALL'} = route?.params || {};

  const {
    callLogs,
    loadMore,
    refresh,
    isRefreshing,
    hasMore,
  } = useCallLogs(type);

  useEffect(() => {
    const loadInitial = async () => {
      const { logs, hasMore, newOffset } = await getFilteredLogsPaginated(type, 0);
      setFilteredLogs(logs);
      setFilteredHasMore(hasMore);
      setFilteredOffset(newOffset);
    };
    loadInitial();
  }, [type, getFilteredLogsPaginated]);

  const handleLoadMore = async () => {
    if (!filteredHasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    const { logs, hasMore, newOffset } = await getFilteredLogsPaginated(type, filteredOffset);
    setFilteredLogs(prev => [...prev, ...logs]);
    setFilteredHasMore(hasMore);
    setFilteredOffset(newOffset);
    setIsLoadingMore(false);
  };

  const formatDate = (dateTime: string) => {
    const date = moment(dateTime, 'DD-MMM-YYYY hh:mm:ss a');
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) return date.format('h:mm A');
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    return date.format('DD-MMM-YYYY');
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.row}>
      <View style={styles.innerRow}>
        <View style={styles.iconContainer}>
          {item?.name ? (
            <Avatar
              size={50}
              rounded
              title={item?.name?.charAt(0)}
              containerStyle={{backgroundColor: '#3d4db7'}}
            />
          ) : (
            <Icon name="person" iconFamily="Ionicons" color="#3d4db7" size={RFValue(24)} />
          )}
        </View>
        <View>
          <Text style={{fontSize: RFValue(18)}}>{item.name || item.phoneNumber}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            {item?.type === 'MISSED' && (
              <Icon name="call-missed" iconFamily="MaterialIcons" color="red" size={RFValue(14)} />
            )}
            {item?.type === 'INCOMING' && (
              <Icon name="arrow-bottom-left" iconFamily="MaterialCommunityIcons" color="green" size={RFValue(14)} />
            )}
            {item?.type === 'OUTGOING' && (
              <Icon name="arrow-top-right" iconFamily="MaterialCommunityIcons" color="blue" size={RFValue(14)} />
            )}
            <Text>{formatDate(item?.dateTime)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getKey = (item: any) => `${item.phoneNumber}_${item.timestamp}`;

  return (
    <View style={{padding: 10}}>
      <Pressable onPress={goBack}>
        <Icon name="arrow-back-sharp" iconFamily="Ionicons" size={RFValue(24)} color="#000" />
      </Pressable>

      <View style={{padding: 10}}>
        {!callLogs.length && <ActivityIndicator size="large" />}
        <FlatList
  data={filteredLogs}
  renderItem={renderItem}
  keyExtractor={getKey}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.3}
  ListFooterComponent={
    isLoadingMore ? <ActivityIndicator /> : null
  }
  showsVerticalScrollIndicator={false}
/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#3d4db7',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FilteredCallLogs;
