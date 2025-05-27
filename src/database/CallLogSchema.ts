import Realm from 'realm';

export interface ICallLog {
  id: string; // Unique ID to avoid duplicates
  phoneNumber: string;
  timestamp: number | string;
  duration: number | string;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'UNKNOWN';
  dateTime: string;
  name?: string;
  rawType: number | string;
  syncState: 'PENDING' | 'SYNCED' | 'FAILED'; 
  lastSyncedTimestamp?: number; 
  feedback: string | null; 
}

export const CallLogSchema = {
  name: 'CallLog',
  properties: {
    id: 'string',
    phoneNumber: 'string',
    timestamp: 'int',
    duration: 'int',
    type: 'string',
    dateTime: 'string',
    name: 'string?',
    rawType: 'int',
    syncState: 'string',
    lastSyncedTimestamp: 'int?',
    feedback: 'string?',
  },
  primaryKey: 'id',
};
