import { Navigate, NavLink, useLocation, type Location } from 'react-router-dom';
import { useAppSelector } from '../../../../main/bll/store';
import type { User } from '../../../../main/types/user';
import { PATH } from '../../../../main/ui/Main/paths';
import { Logo } from '../../../../main/ui/common/components/Logo/Logo';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const authUser = useAppSelector<User | null>((state) => state.profile.user);
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  if (authUser) {
    return <Navigate to={from ?? PATH.PACK_LIST} replace />;
  }

  return (
    <div className="card form-container">
      <div className="form-header">
        <Logo />
        <h1>Sign In</h1>
      </div>
      <LoginForm />
      <div className="form-footer">
        <p className="form-note">Don’t have an account?</p>
        <NavLink to={PATH.REGISTRATION}>Sign Up</NavLink>
      </div>
    </div>
  );
};
