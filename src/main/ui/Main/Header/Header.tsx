import { useAppSelector } from '../../../bll/store';
import { Logo } from '../../common/components/Logo/Logo';
import { UserMenu } from '../../common/components/UserMenu/UserMenu';
import s from './Header.module.css';

export const Header = () => {
  const authUser = useAppSelector((state) => state.profile.user);

  if (!authUser) {
    return;
  }

  return (
    <header className={s['header']}>
      <div className={s['header-content']}>
        <Logo />
        <UserMenu user={authUser} />
      </div>
    </header>
  );
};
