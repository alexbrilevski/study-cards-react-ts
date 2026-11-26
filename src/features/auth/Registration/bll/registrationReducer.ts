import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../../main/bll/createAppAsyncThunk';
import { getErrorMessage } from '../../../../utils/notificationUtils';
import { registrationAPI } from '../dal/registrationApi';

type RegistrationState = {
  success: boolean;
  error: string | null;
};

export type SignUpFormData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const initialState: RegistrationState = {
  success: false,
  error: null,
};

export const register = createAppAsyncThunk(
  'registration/register',
  async ({ email, password, passwordConfirm }: SignUpFormData, { rejectWithValue }) => {
    if (password !== passwordConfirm) {
      return rejectWithValue("Passwords don't match");
    }

    try {
      await registrationAPI.register(email, password);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setRegistrationSuccess(state, action: PayloadAction<boolean>) {
      state.success = action.payload;
    },
    setRegistrationFormError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { setRegistrationSuccess, setRegistrationFormError } =
  registrationSlice.actions;
export const registrationReducer = registrationSlice.reducer;
