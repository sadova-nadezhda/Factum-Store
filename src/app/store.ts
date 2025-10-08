import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { catalogApi } from '../features/catalog/catalogAPI';
import { faqApi } from '../features/faq/faqAPI';
import { authApi } from '../features/auth/authAPI';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      catalogApi.middleware,
      faqApi.middleware
    ),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;