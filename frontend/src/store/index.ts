import { configureStore } from '@reduxjs/toolkit';
import { loadApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [loadApi.reducerPath]: loadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
