import axios, { AxiosError } from 'axios';
import type { Dispatch } from 'redux';
import { setAppNotification } from '../main/bll/appReducer';

export const handleApiRequestError = (error: Error | AxiosError, dispatch: Dispatch) => {
  if (axios.isCancel(error)) return;

  const errorMessage = axios.isAxiosError<{ error?: string }>(error)
    ? (error.response?.data?.error ?? error.message)
    : error.message + ', more details in the console';
  console.log('Error: ', errorMessage);

  dispatch(setAppNotification({ type: 'error', message: errorMessage }));
};
