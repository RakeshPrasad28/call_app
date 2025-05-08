import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallLog {
  phoneNumber: string;
  timestamp: number;
  duration: number;
  type: 'INCOMING' | 'OUTGOING' | 'MISSED';
  dateTime: string;
  name?: string;
  rawType: number;
}

interface PersonalCallLogState {
  phoneNumber: string | null;
  logs: CallLog[];
  minTimestamp: number | null;
  isLoading: boolean;
}

const initialState: PersonalCallLogState = {
  phoneNumber: null,
  logs: [],
  minTimestamp: null,
  isLoading: false,
};

const personalCallLogSlice = createSlice({
  name: 'personalCallLogs',
  initialState,
  reducers: {
    setPersonalPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setPersonalCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      state.logs = action.payload;
    },
    appendPersonalCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      const newLogs = action.payload;
      const existingLogs = state.logs;

      const uniqueLogs = [
        ...existingLogs,
        ...newLogs.filter(
          log => !existingLogs.some(existing => existing.timestamp === log.timestamp),
        ),
      ];

      state.logs = uniqueLogs;
    },
    setPersonalMinTimestamp: (state, action: PayloadAction<number | null>) => {
      state.minTimestamp = action.payload;
    },
    setPersonalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearPersonalLogs: (state) => {
      state.logs = [];
      state.minTimestamp = null;
      state.phoneNumber = null;
    },
  },
});

export const {
  setPersonalPhoneNumber,
  setPersonalCallLogs,
  appendPersonalCallLogs,
  setPersonalMinTimestamp,
  setPersonalLoading,
  clearPersonalLogs,
} = personalCallLogSlice.actions;

export default personalCallLogSlice.reducer;
