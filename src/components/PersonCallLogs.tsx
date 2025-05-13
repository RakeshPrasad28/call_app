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
  feedback?: string | null;
  id?: string;
}

const PersonCallLogs = () => {
  const route = useRoute();
  const params = route.params as {item?: {phoneNumber: string; name?: string}};
  const phoneNumber = params?.item?.phoneNumber;
  const name = params?.item?.name;

  const [logsForNumber, setLogsForNumber] = useState<ICallLog[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadAllCallLogs = useCallback(async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      const realm = await CallLogDatabase.initialize();
      const results = realm.objects<ICallLog>('CallLog')
        .filtered('phoneNumber == $0', phoneNumber)
        .sorted('timestamp', true);

      setLogsForNumber(Array.from(results));
    } catch (error) {
      console.log('Error loading call logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    loadAllCallLogs();
  }, [loadAllCallLogs]);

  const handleOpenModal = (item: ICallLog) => {
    setCurrentKey(item.id);
    setFeedbackText(item.feedback || '');
    setModalVisible(true);
  };

  const handleSaveFeedback = async () => {
    if (currentKey) {
      const success = await CallLogDatabase.setFeedback(currentKey, feedbackText);
      if (success) {
        setLogsForNumber(prev => 
          prev.map(log => 
            log.id === currentKey ? {...log, feedback: feedbackText} : log
          )
        );
      }
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
      <TouchableOpacity
        style={[styles.callLogContainer, item.feedback && styles.callLogWithFeedback]}
        onPress={() => handleOpenModal(item)}>
        <View style={styles.callLogInfo}>
          <View style={styles.callLogText}>
            <Text style={styles.dateText}>{formatDate(item.dateTime)}</Text>
            <Text style={styles.typeText}>{item.type === 'UNKNOWN' ? 'INCOMING' : item.type}</Text>
          </View>
        </View>
        <View style={{alignItems:"center"}}>
        <Text style={styles.durationText}>{item.duration ? formatTime(item.duration) : null}</Text>
        {item.feedback && (
          <Icon 
            name="message-text" 
            iconFamily="MaterialCommunityIcons" 
            color={Colors.nightInManchestor} 
            size={RFValue(14)} 
          />
        )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!phoneNumber) {
    return (
      <View style={styles.container}>
        <Text>No phone number provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={{alignSelf: 'flex-start'}}>
          <Icon name="arrow-back-sharp" iconFamily="Ionicons" size={RFValue(24)} color={Colors.black} />
        </Pressable>
        <View style={styles.iconContainer}>
          {name ? (
            <Avatar size={80} rounded title={name[0]} containerStyle={{backgroundColor: Colors.nightInManchestor}} />
          ) : (
            <Icon name="person" iconFamily="Ionicons" color={Colors.nightInManchestor} size={RFValue(24)} />
          )}
        </View>
        <Text style={styles.nameText}>{name || phoneNumber}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={logsForNumber}
          renderItem={renderItem}
          keyExtractor={item => `${item.phoneNumber}_${item.timestamp}`}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Icon name="close-circle-outline" iconFamily="Ionicons" size={RFValue(30)} color={Colors.black} />
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
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: RFValue(24),
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
  },
  callLogText: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: RFValue(16),
    color: Colors.stoneCold,
  },
  typeText: {
    fontSize: RFValue(12),
    color: Colors.argent,
  },
  durationText: {
    fontSize: RFValue(14),
    color: Colors.carbon,
    fontWeight: '500',
  },
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
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: Colors.black,
  },
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PersonCallLogs;