import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {selectCallLogsByPhoneNumber} from '../state/slice/callLogSlice';
import {AppDispatch, RootState} from '../state/store';
import Icon from './common/Icon';
import {goBack} from '../utility/NavigationUtils';
import {Avatar} from '@rneui/themed';
import {setFeedback, selectFeedback} from '../state/slice/feedbackSlice';
import { Colors } from '../utility/constants';

const PersonCallLogs = () => {
  const route = useRoute();
  const {item} = route?.params || {};
  const dispatch = useDispatch<AppDispatch>();

  const logsForNumber = useSelector((state: RootState) =>
    selectCallLogsByPhoneNumber(state, item?.phoneNumber),
  );
  const feedbackMap = useSelector((state: RootState) => state.feedback);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');

  const existingFeedback = useSelector((state: RootState) =>
    currentKey ? selectFeedback(state, currentKey) : '',
  );

  useEffect(() => {
    if (modalVisible && currentKey) {
      setFeedbackText(existingFeedback || '');
    }
  }, [modalVisible, currentKey, existingFeedback]);

  const handleOpenModal = (key: string) => {
    setCurrentKey(key);
    setModalVisible(true);
  };

  const handleSaveFeedback = () => {
    if (currentKey) {
      dispatch(setFeedback({key: currentKey, feedback: feedbackText}));
    }
    setModalVisible(false);
  };

  const formatDate = (dateTime: string) => {
    const date = moment(dateTime, 'DD-MMM-YYYY hh:mm:ss a');
    if (!date.isValid()) return 'Invalid Date';

    const now = moment();
    const yesterday = moment().subtract(1, 'days');

    if (date.isSame(now, 'day')) {
      return date.format('hh:mm A');
    } else if (date.isSame(yesterday, 'day')) {
      return `Yesterday ${date.format('hh:mm A')}`;
    } else {
      return date.format('DD-MMM-YYYY hh:mm A');
    }
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
      const remainingSeconds = seconds % 60;

      return `${String(minutes).padStart(2, '0')}:${String(
        remainingSeconds,
      ).padStart(2, '0')}`;
    }

    return `${seconds}s`;
  };

  const renderItem = ({item}: any) => {
    
    const feedbackExists = Boolean(feedbackMap[item.dateTime]);
    return (
      <TouchableOpacity
        style={[
          styles.callLogContainer,
          feedbackExists && styles.callLogWithFeedback,
        ]}
        onPress={() => handleOpenModal(item.dateTime)}>
        <View style={styles.callLogInfo}>
          {/* Icons */}
          {item?.type === 'MISSED' && (
            <Icon
              name="call-missed"
              iconFamily="MaterialIcons"
              color="red"
              size={RFValue(18)}
            />
          )}
          {['INCOMING', 'UNKNOWN'].includes(item?.type) && (
            <Icon
              name="arrow-bottom-left"
              iconFamily="MaterialCommunityIcons"
              color="green"
              size={RFValue(18)}
            />
          )}
          {item?.type === 'OUTGOING' && (
            <Icon
              name="arrow-top-right"
              iconFamily="MaterialCommunityIcons"
              color="blue"
              size={RFValue(18)}
            />
          )}
          <View style={styles.callLogText}>
            <Text style={styles.dateText}>{formatDate(item?.dateTime)}</Text>
            <Text style={styles.typeText}>
              {item?.type === 'UNKNOWN' ? 'INCOMING' : item?.type}
            </Text>
          </View>
        </View>
        <Text style={styles.durationText}>
          {item?.duration ? formatTime(item?.duration) : null}
        </Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={{alignSelf: 'flex-start'}}>
          <Icon
            name="arrow-back-sharp"
            iconFamily="Ionicons"
            size={RFValue(24)}
            color={Colors.black}
          />
        </Pressable>
        <View style={styles.iconContainer}>
          {item?.name ? (
            <Avatar
              size={80}
              rounded
              title={item?.name ? item?.name?.split('')[0] : ''}
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
        <Text style={styles.nameText}>{item?.name || item?.phoneNumber}</Text>
      </View>

      <FlatList
        data={logsForNumber}
        renderItem={renderItem}
        keyExtractor={item => item.dateTime}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Icon
                  name="close-circle-outline"
                  iconFamily="Ionicons"
                  size={RFValue(30)}
                  color={Colors.black}
                />
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter feedback..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
            />
            <Button title="Save" onPress={handleSaveFeedback} />
          </View>
        </View>
      </Modal>
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
  header: {alignItems: 'center', justifyContent: 'center', marginBottom: 20},
  nameText: {fontSize: RFValue(24), fontWeight: 'bold', color: Colors.carbon},
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
  callLogInfo: {flexDirection: 'row', alignItems: 'center', gap: 10},
  callLogText: {marginLeft: 10},
  dateText: {fontSize: RFValue(16), color: Colors.stoneCold},
  typeText: {fontSize: RFValue(12), color: Colors.argent},
  durationText: {fontSize: RFValue(14), color: Colors.carbon, fontWeight: '500'},
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: Colors.nightInManchestor,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {fontSize: RFValue(16), fontWeight: 'bold', color: Colors.black},
  input: {
    borderWidth: 1,
    borderColor: Colors.cerebralGrey,
    padding: 10,
    borderRadius: 6,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  callLogWithFeedback: {
    backgroundColor: Colors.titaniumWhite,
  },
});

export default PersonCallLogs;
