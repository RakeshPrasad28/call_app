import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  BackHandler,
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {screenHeight} from '../utility/Scaling';
import {useFocusEffect} from '@react-navigation/native';

const CallLogScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {selectedFilter} = useSelector((state: RootState) => state.callLogs);
  const {callLogs, loadMore, refresh, isRefreshing, hasMore, totalCount} =
    useCallLogs(selectedFilter);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    if (callLogs.length > 0) {
      setInitialLoadComplete(true);
    }
  }, [callLogs]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 500);
  };

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
          <Text style={{fontSize: RFValue(18),color:darkMode?Colors.white:Colors.black}}>
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
            <Text style={{color:darkMode?Colors.white:Colors.black}}>{formatDate(item.timestamp)}</Text>
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
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'ios' ? 0 : insets.top},
        {backgroundColor: darkMode ? Colors.black : '#f5f5f5'},
      ]}>
      <SafeAreaView />
      <Search
        onToggleMenu={() => setIsMenuVisible(!isMenuVisible)}
        onSelectItem={handleSearchSelect}
      />

      {isMenuVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
            style={styles.modalBackground}>
            <View style={[styles.modalPosition, {top: insets.top + 60}]}>
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
        </View>
      )}
      {!initialLoadComplete && callLogs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading call history...</Text>
        </View>
      ) : (
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
          ref={flatListRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={() => {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
          }}
          activeOpacity={0.8}>
          <Icon
            name="arrow-up-circle"
            iconFamily="Ionicons"
            size={RFValue(40)}
            color={Colors.nightInManchestor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalPosition: {
    position: 'absolute',
    right: 28,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 11,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  scrollTopButton: {
    position: 'absolute',
    bottom: screenHeight - 720,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 5,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: RFValue(16),
    color: Colors.carbon,
  },
});

export default CallLogScreen;
