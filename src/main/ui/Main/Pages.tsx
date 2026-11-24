import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Error404 } from './pages/Error404/Error404';
import { RequireAuth } from './RequireAuth/RequireAuth';
import { PATH } from './paths';

const Login = lazy(() =>
  import('../../../features/auth/Login/ui/Login').then((m) => ({ default: m.Login })),
);
const Registration = lazy(() =>
  import('../../../features/auth/Registration/ui/Registration').then((m) => ({
    default: m.Registration,
  })),
);
const Profile = lazy(() =>
  import('../../../features/profile/ui/Profile').then((m) => ({ default: m.Profile })),
);
const PasswordRecovery = lazy(() =>
  import('../../../features/auth/PasswordRecovery/ui/PasswordRecovery').then((m) => ({
    default: m.PasswordRecovery,
  })),
);
const PasswordRecoveryConfirm = lazy(() =>
  import('../../../features/auth/PasswordRecovery/ui/PasswordRecoveryConfirm').then(
    (m) => ({ default: m.PasswordRecoveryConfirm }),
  ),
);
const NewPassword = lazy(() =>
  import('../../../features/auth/PasswordRecovery/ui/NewPassword').then((m) => ({
    default: m.NewPassword,
  })),
);
const PackList = lazy(() =>
  import('../../../features/packList/ui/PackList').then((m) => ({ default: m.PackList })),
);
const CardList = lazy(() =>
  import('../../../features/cardList/ui/CardList').then((m) => ({ default: m.CardList })),
);
const LearnPage = lazy(() =>
  import('../../../features/learn/ui/LearnPage').then((m) => ({ default: m.LearnPage })),
);
const Test = import.meta.env.DEV
  ? lazy(() => import('../../../features/test/Test').then((m) => ({ default: m.Test })))
  : null;

export const Pages = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={'/'} element={<Navigate to={PATH.LOGIN} replace />} />
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.REGISTRATION} element={<Registration />} />
        <Route path={PATH.PASSWORD_RECOVERY} element={<PasswordRecovery />} />
        <Route
          path={PATH.PASSWORD_RECOVERY_CONFIRM}
          element={<PasswordRecoveryConfirm />}
        />
        <Route path={PATH.CREATE_NEW_PASSWORD + '/:token'} element={<NewPassword />} />
        <Route element={<RequireAuth />}>
          <Route path={PATH.PROFILE} element={<Profile />} />
          <Route path={PATH.PACK_LIST} element={<PackList />} />
          <Route path={PATH.CARD_LIST + '/:cardPackId'} element={<CardList />} />
          <Route path={PATH.LEARN + '/:cardPackId'} element={<LearnPage />} />
        </Route>
        {Test && <Route path={PATH.TEST} element={<Test />} />}
        <Route path={PATH.ERROR404} element={<Error404 />} />
        <Route path={'*'} element={<Navigate to={PATH.ERROR404} replace />} />
      </Routes>
    </Suspense>
  );
};
