import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../../main/bll/createAppAsyncThunk';
import { getErrorMessage } from '../../../../utils/notificationUtils';
import { passwordAPI } from '../dal/passwordApi';

type NewPasswordState = {
  success: boolean;
  error: string | null;
};

type NewPasswordData = {
  password: string;
  token: string;
};

const initialState: NewPasswordState = {
  success: false,
  error: null,
};

export const setNewPassword = createAppAsyncThunk(
  'newPassword/setNewPassword',
  async ({ password, token }: NewPasswordData, { rejectWithValue }) => {
    try {
      await passwordAPI.setNewPassword(password, token);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const newPasswordSlice = createSlice({
  name: 'newPassword',
  initialState,
  reducers: {
    setNewPasswordSuccess(state, action: PayloadAction<boolean>) {
      state.success = action.payload;
    },
    setNewPasswordFormError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setNewPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { setNewPasswordSuccess, setNewPasswordFormError } =
  newPasswordSlice.actions;
export const newPasswordReducer = newPasswordSlice.reducer;
