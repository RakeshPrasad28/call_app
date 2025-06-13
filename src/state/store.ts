import { configureStore } from '@reduxjs/toolkit';
import callLogReducer from './slice/callLogSlice';
import feedbackReducer from './slice/feedbackSlice';
import themeReducer from './slice/themeSlice';

export const store = configureStore({
  reducer: {
    callLogs: callLogReducer,
    feedback: feedbackReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
