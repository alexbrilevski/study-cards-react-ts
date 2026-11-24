import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../bll/store';
import type { User } from '../../../types/user';
import { PATH } from '../Pages';

export const RequireAuth = () => {
  const authUser = useAppSelector<User | null>((state) => state.profile.user);
  const location = useLocation();

  if (!authUser) {
    return <Navigate to={PATH.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
