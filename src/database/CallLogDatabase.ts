import Realm from 'realm';

export interface ICallLogInput {
  phoneNumber: string;
  timestamp: number | string;
  duration: number | string;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'UNKNOWN';
  dateTime: string;
  name?: string;
  rawType: number | string;
}

export interface ICallLog extends Omit<ICallLogInput, 'timestamp' | 'duration' | 'rawType'> {
  id: string;
  timestamp: number;
  duration: number;
  rawType: number;
  synced: boolean;
  createdAt: Date;
}

class CallLogSchema extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: 'CallLog',
    primaryKey: 'id',
    properties: {
      id: 'string',
      phoneNumber: 'string',
      timestamp: 'int',
      duration: 'int',
      type: 'string',
      dateTime: 'string',
      name: 'string?',
      rawType: 'int',
      synced: { type: 'bool', default: false },
      createdAt: 'date',
    },
  };
}

const databaseOptions: Realm.Configuration = {
  schema: [CallLogSchema],
  schemaVersion: 2, 
};

let realmInstance: Realm | null = null;

const getRealmInstance = async (): Promise<Realm> => {
  if (!realmInstance) {
    realmInstance = await Realm.open(databaseOptions);
  }
  return realmInstance;
};

const normalizeTimestamp = (value: unknown): number => {
  if (typeof value === 'number') {
    return value > 10000000000 ? value : value * 1000;
  }
  
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      return num > 10000000000 ? num : num * 1000;
    }
    
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
    
    const androidDate = new Date(value.replace(' ', 'T') + 'Z');
    if (!isNaN(androidDate.getTime())) {
      return androidDate.getTime();
    }
  }
  
  console.warn('Invalid timestamp value:', value);
  return Date.now();
};

export const ensureNumber = (value: unknown, fieldName = ''): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  }
  console.warn(`Unexpected type for ${fieldName}:`, typeof value);
  return 0;
};

const validateCallLog = (log: any) => {
  if (!log.phoneNumber) {
    throw new Error('Missing phone number');
  }

  const timestamp = normalizeTimestamp(log.timestamp);
  if (timestamp <= 0) {
    throw new Error('Invalid timestamp');
  }

  const normalizedPhone = log.phoneNumber.replace(/\D/g, '').slice(-10);

  return {
    ...log,
    phoneNumber: normalizedPhone,
    timestamp,
    duration: ensureNumber(log.duration, 'duration'),
    rawType: ensureNumber(log.rawType, 'rawType'),
    id: `${normalizedPhone}_${timestamp}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  };
};

export const CallLogDatabase = {
  initialize: async () => getRealmInstance(),

  hasData: async (): Promise<boolean> => {
    const realm = await getRealmInstance();
    return realm.objects('CallLog').length > 0;
  },

  getNewestTimestamp: async (): Promise<number | null> => {
    const realm = await getRealmInstance();
    const results = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);
    return results.length > 0 ? results[0].timestamp : null;
  },

  getCallLogsBatch: async (
    offset: number,
    limit: number,
    filter: 'ALL' | 'INCOMING' | 'OUTGOING' | 'MISSED',
  ) => {
    const realm = await CallLogDatabase.initialize();
    let query = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);

    if (filter !== 'ALL') {
      query = query.filtered('type == $0', filter);
    }

    const totalCount = query.length;
    const logs = Array.from(query.slice(offset, offset + limit));

    return {
      logs,
      totalCount,
      hasMore: offset + logs.length < totalCount,
    };
  },

  searchCallLogs: async (query: string): Promise<ICallLog[]> => {
    const realm = await getRealmInstance();
    const results = realm
      .objects('CallLog')
      .filtered('phoneNumber CONTAINS[c] $0 OR name CONTAINS[c] $0', query)
      .sorted('timestamp', true);
    return Array.from(results) as ICallLog[];
  },

  getUnsyncedCallLogs: async (): Promise<ICallLog[]> => {
    const realm = await getRealmInstance();
    const results = realm
      .objects('CallLog')
      .filtered('synced == false')
      .sorted('timestamp', true);
    return Array.from(results) as ICallLog[];
  },

  markAsSynced: async (ids: string[]): Promise<void> => {
    const realm = await getRealmInstance();
    realm.write(() => {
      ids.forEach(id => {
        const log = realm.objectForPrimaryKey('CallLog', id);
        if (log) {
          (log as ICallLog).synced = true;
        }
      });
    });
  },

  storeCallLogs: async (logs: ICallLogInput[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const realm = await getRealmInstance();
      let storedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      console.log('Attempting to store batch of', logs.length, 'logs');
      
      realm.write(() => {
        logs.forEach(log => {
          try {
            const validatedLog = validateCallLog(log);
            
            console.log('Processing log:', {
              phone: validatedLog.phoneNumber,
              timestamp: new Date(validatedLog.timestamp),
              type: validatedLog.type
            });

            const existing = realm.objects('CallLog')
              .filtered('phoneNumber == $0 AND timestamp == $1', 
                validatedLog.phoneNumber, 
                validatedLog.timestamp)
              .length > 0;

            if (!existing) {
              realm.create('CallLog', {
                ...validatedLog,
                synced: false,
                createdAt: new Date(),
              });
              storedCount++;
            } else {
              duplicateCount++;
            }
          } catch (error) {
            errorCount++;
            console.warn('Skipping invalid log:', error, log);
          }
        });
      });

      console.log(
        `Stored ${storedCount} logs | ` +
        `Duplicates: ${duplicateCount} | ` +
        `Errors: ${errorCount}`
      );
      
      return { success: true };
    } catch (error) {
      console.error('Storage transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown storage error',
      };
    }
  },

  getTotalCount: async (): Promise<number> => {
    const realm = await getRealmInstance();
    return realm.objects('CallLog').length;
  },

  clearAll: async (): Promise<void> => {
    const realm = await getRealmInstance();
    realm.write(() => {
      realm.deleteAll();
    });
  },

  forceRefreshAllLogs: async (): Promise<void> => {
    const realm = await getRealmInstance();
    realm.write(() => {
      realm.deleteAll();
    });
    console.log('Cleared all logs - ready for fresh sync');
  },

  debugPrintLogs: async () => {
    const realm = await getRealmInstance();
    const all = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);
    console.log('--- All Call Logs ---');
    all.slice(0, 10).forEach(log => {
      console.log(`${new Date(log.timestamp)} - ${log.phoneNumber} - ${log.type}`);
    });
    console.log(`Total logs: ${all.length}`);
  },
};

export default CallLogDatabase;