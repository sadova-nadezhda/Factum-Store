import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './authAPI';

type AuthState = { token: string | null };
const initialState: AuthState = { token: localStorage.getItem('token') };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) localStorage.setItem('token', action.payload);
      else localStorage.removeItem('token');
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authSlice.actions.logout, (state, action) => {
    });
  }
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;