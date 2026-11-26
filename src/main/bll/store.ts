import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { appReducer } from './appReducer';
import { registrationReducer } from '../../features/auth/Registration/bll/registrationReducer';
import { loginReducer } from '../../features/auth/Login/bll/loginReducer';
import { newPasswordReducer } from '../../features/auth/PasswordRecovery/bll/newPasswordReducer';
import { passwordRecoveryReducer } from '../../features/auth/PasswordRecovery/bll/passwordRecoveryReducer';
import { profileReducer } from '../../features/profile/bll/profileReducer';
import { packListReducer } from '../../features/packList/bll/packListReducer';
import { cardListReducer } from '../../features/cardList/bll/cardListReducer';
import { learnReducer } from '../../features/learn/bll/learnReducer';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Custom useDispatch and useSelector: Use throughout app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
  reducer: {
    app: appReducer,
    registration: registrationReducer,
    login: loginReducer,
    profile: profileReducer,
    newPassword: newPasswordReducer,
    passwordRecovery: passwordRecoveryReducer,
    packList: packListReducer,
    cardList: cardListReducer,
    learn: learnReducer,
  },
});
