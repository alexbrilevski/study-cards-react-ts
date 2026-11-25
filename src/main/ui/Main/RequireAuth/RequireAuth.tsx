import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../bll/store';
import { PATH } from '../paths';

export const RequireAuth = () => {
  const authUser = useAppSelector((state) => state.profile.user);
  const location = useLocation();

  if (!authUser) {
    return <Navigate to={PATH.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
