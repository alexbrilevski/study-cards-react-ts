import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../../main/bll/createAppAsyncThunk';
import { getErrorMessage } from '../../../../utils/notificationUtils';
import { passwordAPI } from '../dal/passwordApi';

type PasswordRecoveryState = {
  recoveryEmail: string;
  error: string | null;
};

const initialState: PasswordRecoveryState = {
  recoveryEmail: '',
  error: null,
};

export const recoverPassword = createAppAsyncThunk(
  'passwordRecovery/recoverPassword',
  async (email: string, { rejectWithValue }) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const message = `<div>Password recovery link:<a href='${baseURL}/#/create-new-password/$token$'>link</a></div>`;

    try {
      await passwordAPI.forgot(email, message);
      return email;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const passwordRecoverySlice = createSlice({
  name: 'passwordRecovery',
  initialState,
  reducers: {
    setRecoveryEmail(state, action: PayloadAction<string>) {
      state.recoveryEmail = action.payload;
    },
    setPasswordRecoveryFormError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recoverPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(recoverPassword.fulfilled, (state, action) => {
        state.recoveryEmail = action.payload;
      })
      .addCase(recoverPassword.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { setRecoveryEmail, setPasswordRecoveryFormError } =
  passwordRecoverySlice.actions;
export const passwordRecoveryReducer = passwordRecoverySlice.reducer;
