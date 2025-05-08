import {View, Text, ActivityIndicator, FlatList, Pressable, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import { selectFilteredCallLogs } from '../state/slice/callLogSlice';
import Icon from './common/Icon';
import { goBack, navigate } from '../utility/NavigationUtils';
import { RootState } from '../state/store';
import {Avatar} from '@rneui/themed';

const FilteredCallLogs = () => {
  const route = useRoute();
  const {type} = route?.params || '';
  //   console.log(route?.params?.type,"routray")

  const filteredLogs = useSelector((state:RootState) =>
    selectFilteredCallLogs(state, type),
  );
  //   console.log(filteredLogs,"logo")

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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}>
        {/* <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#000',
          }}
        /> */}
        <View style={styles.iconContainer}>
          {item?.name ? (
            <Avatar
              size={50}
              rounded
              title={item?.name ? item?.name?.split('')[0] : ''}
              containerStyle={{backgroundColor: '#3d4db7'}}
            />
          ) : (
            <Icon name='person' iconFamily='Ionicons' color='#3d4db7' size={RFValue(24)}/>
          )}
        </View>
        <View>
          <Text style={{fontSize: RFValue(18)}}>
            {item.name || item.phoneNumber}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            {item?.type === 'MISSED' && (
              <Icon
                name="call-missed"
                iconFamily="MaterialIcons"
                color="red"
                size={RFValue(14)}
              />
            )}
            {item?.type === 'INCOMING' && (
              <Icon
                name="arrow-bottom-left"
                iconFamily="MaterialCommunityIcons"
                color="green"
                size={RFValue(14)}
              />
            )}
            {item?.type === 'OUTGOING' && (
              <Icon
                name="arrow-top-right"
                iconFamily="MaterialCommunityIcons"
                color="blue"
                size={RFValue(14)}
              />
            )}
            <Text>{formatDate(item?.dateTime)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  // KeyExtractor
  const getKey = (item: any): string => `${item.phoneNumber}_${item.timestamp}`;
  return (
    <View style={{padding: 10}}>
      <Pressable onPress={() => goBack()}>
        <Icon
          name="arrow-back-sharp"
          iconFamily="Ionicons"
          size={RFValue(24)}
          color="#000"
        />
      </Pressable>
      <View style={{padding: 10}}>
        {!filteredLogs && <ActivityIndicator size="large" />}

        <FlatList
          data={filteredLogs}
          renderItem={renderItem}
          keyExtractor={getKey}
          // onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          // ListFooterComponent={isFetching && <Text>Loading more...</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#3d4db7',
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default FilteredCallLogs;
