import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../../main/types/user';
import { createAppAsyncThunk } from '../../../main/bll/createAppAsyncThunk';
import { initializeApp } from '../../../main/bll/appReducer';
import { getErrorMessage } from '../../../utils/notificationUtils';
import { profileAPI } from '../dal/profileApi';

type ProfileState = {
  user: User | null;
  error: string | null;
};

const initialState: ProfileState = {
  user: null,
  error: null,
};

export const saveUpdatedUserData = createAppAsyncThunk(
  'profile/saveUpdatedUserData',
  async ({ name, avatar }: { name: string; avatar: string }, { rejectWithValue }) => {
    try {
      const data = await profileAPI.updateUserData(name, avatar);
      return data.updatedUser;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setEditProfileFormError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(saveUpdatedUserData.pending, (state) => {
        state.error = null;
      })
      .addCase(saveUpdatedUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(saveUpdatedUserData.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});

export const { setAuthUser, setEditProfileFormError } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
