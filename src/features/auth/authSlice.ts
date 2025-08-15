import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginAPI, registerAPI } from './authAPI';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

// Асинхронный экшен для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      const response = await registerAPI(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Асинхронный экшен для логина
export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      return await loginAPI(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен отсутствует');
      const data = await fetchUserAPI(token);
      return data; // { user: { ... } }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.companyData = null;
      state.businessInsights = null;
      localStorage.removeItem('token');
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string, user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.error = 'Registration failed';
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string, user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.error = 'Login failed';
        state.isLoading = false;
      })
      .addCase(logout, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
  },
});

export const {
  logout,
  setAuthChecked,
} = authSlice.actions;

export default authSlice.reducer;