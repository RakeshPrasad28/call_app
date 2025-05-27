import Realm from 'realm';
import { CallLogSchema, ICallLog } from './CallLogSchema';

const realmConfig: Realm.Configuration = {
  schema: [CallLogSchema],
  schemaVersion: 1,
};

let realm: Realm;

const getRealm = () => {
  if (!realm) {
    realm = new Realm(realmConfig);
  }
  return realm;
};

export const saveCallLogs = (callLogs: ICallLog[]) => {
  const realmInstance = getRealm();
  
  realmInstance.write(() => {
    callLogs.forEach(log => {
      // Ensure timestamp is a number
      const timestamp = typeof log.timestamp === 'string' ? parseInt(log.timestamp) : log.timestamp;
      const id = `${log.phoneNumber}-${timestamp}`;
      
      // Only create if it doesn't exist
      if (!realmInstance.objectForPrimaryKey('CallLog', id)) {
        realmInstance.create('CallLog', {
          ...log,
          id,
          timestamp,
          syncState: 'PENDING'
        }, Realm.UpdateMode.Modified);
      }
    });
  });
};

export const getCallLogs = (): Realm.Results<ICallLog> => {
  return getRealm().objects<ICallLog>('CallLog').sorted('timestamp', true); // Newest first
};

export const getCallLogsCount = () => {
  return getCallLogs().length;
};

export const clearCallLogs = () => {
  getRealm().write(() => {
    getRealm().deleteAll();
  });
};

export const searchCallLogs = async (query: string): Promise<ICallLog[]> => {
  const realm = getRealm();
  const results = realm.objects<ICallLog>('CallLog')
    .filtered('phoneNumber CONTAINS[c] $0 OR name CONTAINS[c] $0', query)
    .slice(0, 5); 

  const unique = Array.from(results).reduce((acc: ICallLog[], current) => {
    if (!acc.some(item => item.phoneNumber === current.phoneNumber)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return unique;
};

export const getCallLogsByPhoneNumber = (phoneNumber: string): ICallLog[] => {
  try {
    const realm = getRealm();
    const results = realm
      .objects<ICallLog>('CallLog')
      .filtered('phoneNumber == $0', phoneNumber)
      .sorted('timestamp', true);

    return Array.from(results); 
  } catch (error) {
    console.error('Error fetching call logs by phone number:', error);
    return [];
  }
};

export const setFeedbackForCallLog = (
  id: string,
  feedback: string,
): boolean => {
  try {
    const realm = getRealm();
    const log = realm.objectForPrimaryKey<ICallLog>('CallLog', id);
    if (log) {
      realm.write(() => {
        log.feedback = feedback;
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting feedback for call log:', error);
    return false;
  }
};

export const getFilteredCallLogs = (type: string): ICallLog[] => {
  try {
    const realm = getRealm();
    let results;

    if (type === 'ALL') {
      results = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);
    } else if (type === 'INCOMING') {
      results = realm
        .objects<ICallLog>('CallLog')
        .filtered('type == "INCOMING" OR type == "UNKNOWN"')
        .sorted('timestamp', true);
    } else {
      results = realm
        .objects<ICallLog>('CallLog')
        .filtered('type == $0', type)
        .sorted('timestamp', true);
    }

    return Array.from(results);
  } catch (error) {
    console.error('Error fetching filtered call logs:', error);
    return [];
  }
};


