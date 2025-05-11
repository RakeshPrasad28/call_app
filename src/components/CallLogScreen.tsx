import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import {navigate} from '../utility/NavigationUtils';
import Icon from './common/Icon';
import {Avatar} from '@rneui/themed';
import Search from './Search';
import {Colors} from '../utility/constants';
import {useCallLogs} from '../hooks/useCallLogs';

const CallLogScreen: React.FC = () => {
  const {selectedFilter} = useSelector((state: RootState) => state.callLogs);
  const {callLogs, loadMore, refresh, isRefreshing, hasMore, totalCount} =
    useCallLogs(selectedFilter);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = moment(timestamp);
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) return date.format('h:mm A');
    if (date.isSame(yesterday, 'day')) return 'Yesterday';
    return date.format('DD-MMM-YYYY');
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() =>
        navigate('PersonCallLogs', {
          item: {
            ...item,
            createdAt: item?.createdAt?.toISOString(),
          },
        })
      }
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
            {item.type === 'OUTGOING' && (
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
            )}
            <Text>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getKey = (item: any): string => item.id;

  useEffect(() => {
    if (callLogs.length > 0) {
      console.log('Current call logs stats:', {
        count: callLogs.length,
        oldest: new Date(callLogs[callLogs.length - 1].timestamp),
        newest: new Date(callLogs[0].timestamp),
      });
    }
  }, [callLogs]);

  const handleSearchSelect = (item: any) => {
    navigate('PersonCallLogs', {
      item: {
        phoneNumber: item.phoneNumber,
        name: item.name,
      },
    });
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Search
        onToggleMenu={() => setIsMenuVisible(!isMenuVisible)}
        onSelectItem={handleSearchSelect}
      />

      {isMenuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
          style={styles.overlay}>
          <View style={styles.modalPosition}>
            <TouchableOpacity
              onPress={() => {
                setIsMenuVisible(false);
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
                setIsMenuVisible(false);
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
                setIsMenuVisible(false);
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

      <FlatList
        data={callLogs}
        renderItem={renderItem}
        keyExtractor={getKey}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={refresh}
        refreshing={isRefreshing}
        ListFooterComponent={
          <>
            {hasMore ? <ActivityIndicator size="small" /> : null}
            <Text style={{textAlign: 'center', padding: 10}}>
              Showing {callLogs.length} of {totalCount} logs
            </Text>
          </>
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
