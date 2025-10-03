import { configureStore } from '@reduxjs/toolkit';
import authReducer  from '../features/auth/authSlice';
import { catalogApi } from '../features/catalog/catalogApi';
import { faqApi } from '../features/faq/faqAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      catalogApi.middleware,
      faqApi.middleware
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;