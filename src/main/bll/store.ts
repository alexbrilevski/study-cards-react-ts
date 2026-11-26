import {
  combineReducers,
  configureStore,
  type Reducer,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { appReducer } from './appReducer';
import { registrationReducer } from '../../features/auth/Registration/bll/registrationReducer';
import { loginReducer } from '../../features/auth/Login/bll/loginReducer';
import { newPasswordReducer } from '../../features/auth/PasswordRecovery/bll/newPasswordReducer';
import { passwordRecoveryReducer } from '../../features/auth/PasswordRecovery/bll/passwordRecoveryReducer';
import { profileReducer } from '../../features/profile/bll/profileReducer';
import { packListReducer } from '../../features/packList/bll/packListReducer';
import { cardListReducer } from '../../features/cardList/bll/cardListReducer';
import { learnReducer, type LearnActions } from '../../features/learn/bll/learnReducer';

export type RootState = ReturnType<typeof store.getState>;

export type RootAction = LearnActions;

export type RootThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
export type AppDispatch = typeof store.dispatch;

// Custom useDispatch and useSelector: Use throughout app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const rootReducer = combineReducers({
  app: appReducer,
  registration: registrationReducer,
  login: loginReducer,
  profile: profileReducer,
  newPassword: newPasswordReducer,
  passwordRecovery: passwordRecoveryReducer,
  packList: packListReducer,
  cardList: cardListReducer,
  learn: learnReducer,
});

export const store = configureStore({
  reducer: rootReducer as unknown as Reducer<
    ReturnType<typeof rootReducer>,
    UnknownAction
  >,
});
