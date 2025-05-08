import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CallLog {
  phoneNumber: string;
  timestamp: number;
  duration: number;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED';
  dateTime:string;
  name?:string;
  rawType:number;
}

interface CallLogState {
  callLogs: CallLog[];
  selectedFilter: 'ALL' | 'INCOMING' | 'OUTGOING' | 'MISSED';
  isLoading: boolean;
  minTimestamp: number | null;
  maxTimestamp: number | null;
}

const initialState: CallLogState = {
  callLogs: [],
  selectedFilter: 'ALL',
  isLoading: false,
  minTimestamp: null,
  maxTimestamp: null,
};

export const callLogSlice = createSlice({
  name: 'callLogs',
  initialState,
  reducers: {
    setCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      state.callLogs = action.payload;
    },
    appendCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      const newLogs = action.payload;
      const existingLogs = state.callLogs;

      // Avoid duplicates based on phoneNumber and timestamp
      const uniqueLogs = [
        ...existingLogs,
        ...newLogs.filter(
          log =>
            !existingLogs.some(
              existingLog => existingLog.timestamp === log.timestamp,
            ),
        ),
      ];

      state.callLogs = uniqueLogs;
    },
    clearCallLogs:(state)=>{
      state.callLogs = [];
      state.minTimestamp = null;
      state.maxTimestamp = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedFilter: (
      state,
      action: PayloadAction<'ALL' | 'INCOMING' | 'OUTGOING' | 'MISSED'>,
    ) => {
      state.selectedFilter = action.payload;
    },
    setMinTimestamp: (state, action: PayloadAction<number | null>) => {
      state.minTimestamp = action.payload;
    },
    setMaxTimestamp: (state, action: PayloadAction<number | null>) => {
      state.maxTimestamp = action.payload;
    },
  },
});

// Selector to get filtered call logs based on type
export const selectFilteredCallLogs = (
  state: {callLogs: CallLogState},
  type: 'ALL' | 'INCOMING' | 'OUTGOING' | 'MISSED',
) => {
  if (type === 'ALL') return state.callLogs.callLogs;
  return state.callLogs.callLogs.filter(log => log.type === type);
};

// Selector to get logs by phone number
export const selectCallLogsByPhoneNumber = (
  state: {callLogs: CallLogState},
  phoneNumber: string,
) => {
  return state.callLogs.callLogs.filter(log => log.phoneNumber === phoneNumber);
};



export const {
  setCallLogs,
  appendCallLogs,
  clearCallLogs,
  setLoading,
  setSelectedFilter,
  setMinTimestamp,
  setMaxTimestamp,
} = callLogSlice.actions;

export default callLogSlice.reducer;
