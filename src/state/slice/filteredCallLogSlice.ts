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

interface FilteredCallLogState {
  logs: CallLog[];
  filterType: 'INCOMING' | 'OUTGOING' | 'MISSED';
  minTimestamp: number | null;
  isLoading: boolean;
}

const initialState: FilteredCallLogState = {
  logs: [],
  filterType: 'INCOMING',
  minTimestamp: null,
  isLoading: false,
};

const filteredCallLogSlice = createSlice({
  name: 'filteredCallLogs',
  initialState,
  reducers: {
    setFilteredCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      state.logs = action.payload;
    },
    appendFilteredCallLogs: (state, action: PayloadAction<CallLog[]>) => {
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
    setFilteredMinTimestamp: (state, action: PayloadAction<number | null>) => {
      state.minTimestamp = action.payload;
    },
    setFilteredType: (
      state,
      action: PayloadAction<'INCOMING' | 'OUTGOING' | 'MISSED'>,
    ) => {
      state.filterType = action.payload;
    },
    setFilteredLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearFilteredLogs: (state) => {
      state.logs = [];
      state.minTimestamp = null;
    },
  },
});

export const {
  setFilteredCallLogs,
  appendFilteredCallLogs,
  setFilteredMinTimestamp,
  setFilteredType,
  setFilteredLoading,
  clearFilteredLogs,
} = filteredCallLogSlice.actions;

export default filteredCallLogSlice.reducer;
