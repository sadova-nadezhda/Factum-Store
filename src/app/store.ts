import { configureStore } from '@reduxjs/toolkit';
import { rootApi } from '@/shared/rootApi';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(rootApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;