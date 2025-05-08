import { configureStore } from '@reduxjs/toolkit';
import callLogReducer from './slice/callLogSlice';
import personalCallLogReducer from './slice/personalCallLogSlice';
import feedbackReducer from './slice/feedbackSlice';

export const store = configureStore({
  reducer: {
    callLogs: callLogReducer,
    personalCallLogs: personalCallLogReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
