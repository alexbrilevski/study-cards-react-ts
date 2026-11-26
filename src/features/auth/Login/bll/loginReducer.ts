import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../../main/bll/createAppAsyncThunk';
import { setAppNotification } from '../../../../main/bll/appReducer';
import {
  getErrorMessage,
  handleApiRequestError,
} from '../../../../utils/notificationUtils';
import { loginAPI } from '../dal/loginApi';

type LoginState = {
  error: string | null;
};

type LoginData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const initialState: LoginState = {
  error: null,
};

export const login = createAppAsyncThunk(
  'login/login',
  async ({ email, password, rememberMe }: LoginData, { rejectWithValue }) => {
    try {
      return await loginAPI.login(email, password, rememberMe);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logout = createAppAsyncThunk('login/logout', async (_, { dispatch }) => {
  try {
    await loginAPI.logout();
    dispatch(
      setAppNotification({
        type: 'success',
        message: 'You logged out successfully',
      }),
    );
  } catch (error) {
    handleApiRequestError(error, dispatch);
    throw error;
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginFormError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { setLoginFormError } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
