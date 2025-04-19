import { configureStore } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';

export const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
  },
});
