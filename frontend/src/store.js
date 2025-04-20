import { configureStore } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
