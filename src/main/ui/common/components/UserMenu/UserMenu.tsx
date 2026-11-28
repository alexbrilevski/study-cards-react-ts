import type { FC } from 'react';
import type { User } from '../../../../types/user';
import { useAppDispatch } from '../../../../bll/store';
import { logout } from '../../../../../features/auth/Login/bll/loginReducer';
import { PATH } from '../../../Main/paths';
import { DropdownMenu, type DropdownMenuItem } from '../DropdownMenu/DropdownMenu';
import defaultUserAvatar from '../../../../../assets/images/default-avatar.svg';
import userIcon from '../../../../../assets/icons/user.svg';
import logoutIcon from '../../../../../assets/icons/logout.svg';
import s from './UserMenu.module.css';

type UserMenuProps = {
  user: User;
};

export const UserMenu: FC<UserMenuProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const items: DropdownMenuItem[] = [
    { key: 'profile', label: 'Profile', icon: userIcon, to: PATH.PROFILE },
    {
      key: 'logout',
      label: 'Log out',
      icon: logoutIcon,
      onSelect: () => dispatch(logout()),
    },
  ];

  return (
    <DropdownMenu
      items={items}
      iconSize={16}
      trigger={
        <>
          <span className={s['user-name']} title={user.name}>
            {user.name}
          </span>
          <img
            className={s['user-avatar']}
            src={user.avatar || defaultUserAvatar}
            width="36"
            height="36"
            alt=""
          />
        </>
      }
    />
  );
};
