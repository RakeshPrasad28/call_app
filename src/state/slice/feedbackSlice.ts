import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FeedbackState {
  [key: string]: string; 
}

const initialState: FeedbackState = {};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback: (state, action: PayloadAction<{key: string; feedback: string}>) => {
      state[action.payload.key] = action.payload.feedback;
    },
  },
});

export const {setFeedback} = feedbackSlice.actions;
export const selectFeedback = (state: any, key: string) => state.feedback[key] || '';
export default feedbackSlice.reducer;
