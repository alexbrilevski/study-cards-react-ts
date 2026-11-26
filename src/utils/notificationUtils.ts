import axios from 'axios';
import type { Dispatch } from 'redux';
import { setAppNotification } from '../main/bll/appReducer';

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? error.message;
  }
  const message = error instanceof Error ? error.message : String(error);
  return message + ', more details in the console';
};

export const handleApiRequestError = (error: unknown, dispatch: Dispatch) => {
  if (axios.isCancel(error)) return;

  const errorMessage = getErrorMessage(error);
  console.log('Error: ', errorMessage);

  dispatch(setAppNotification({ type: 'error', message: errorMessage }));
};
