import { configureStore } from '@reduxjs/toolkit';
import callLogReducer from './slice/callLogSlice';
import personalCallLogReducer from './slice/personalCallLogSlice';
import feedbackReducer from './slice/feedbackSlice';
import themeReducer from './slice/themeSlice';

export const store = configureStore({
  reducer: {
    callLogs: callLogReducer,
    personalCallLogs: personalCallLogReducer,
    feedback: feedbackReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
