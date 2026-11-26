import {
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { appAPI } from '../dal/appApi';
import { createAppAsyncThunk } from './createAppAsyncThunk';
import { handleApiRequestError } from '../../utils/notificationUtils';

export type AppNotification = {
  type: 'error' | 'info' | 'success';
  message: string;
};

type AppState = {
  isInitialized: boolean;
  isLoading: boolean;
  notification: AppNotification | null;
};

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  notification: null,
};

export const initializeApp = createAppAsyncThunk(
  'app/initializeApp',
  async (_, { dispatch }) => {
    try {
      return await appAPI.me();
    } catch (error) {
      if (
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.status === 401
      ) {
        console.log('Error: ', error.response.data?.error);
      } else {
        handleApiRequestError(error, dispatch);
      }
      throw error;
    }
  },
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppNotification(state, action: PayloadAction<AppNotification | null>) {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(initializeApp.fulfilled, initializeApp.rejected), (state) => {
        state.isInitialized = true;
      })
      .addMatcher(isPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(isAnyOf(isFulfilled, isRejected), (state) => {
        state.isLoading = false;
      });
  },
});

export const { setAppNotification } = appSlice.actions;
export const appReducer = appSlice.reducer;
