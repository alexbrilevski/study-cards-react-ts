import { useEffect, type FC } from 'react';
import type { User } from '../../../main/types/user';
import { useAppDispatch, useAppSelector } from '../../../main/bll/store';
import { saveUpdatedUserData, setEditProfileFormError } from '../bll/profileReducer';
import { EditableText } from '../../../main/ui/common/components/EditableTextField/EditableTextField';
import { IconSvg } from '../../../main/ui/common/components/IconSvg/IconSvg';
import { FilePicker } from '../../../main/ui/common/components/FilePicker/FilePicker';
import { resizeImage } from '../../../utils/media';
import defaultAvatar from '../../../assets/images/default-avatar.svg';
import photoIcon from '../../../assets/icons/photo.svg';
import s from './EditProfileForm.module.css';

const AVATAR_SIZE = 192;

type EditProfileFormProps = {
  user: User;
};

export const EditProfileForm: FC<EditProfileFormProps> = ({ user }) => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const error = useAppSelector((state) => state.profile.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      if (error) dispatch(setEditProfileFormError(null));
    };
  }, [error, dispatch]);

  const handleSaveName = (name: string) => {
    if (error) dispatch(setEditProfileFormError(null));
    dispatch(saveUpdatedUserData(name, user.avatar || ''));
  };

  const handleAvatarSelect = async (file: File) => {
    if (error) dispatch(setEditProfileFormError(null));

    try {
      const avatar = await resizeImage(file, AVATAR_SIZE);
      dispatch(saveUpdatedUserData(user.name, avatar));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'The image could not be uploaded';
      dispatch(setEditProfileFormError(message));
    }
  };

  return (
    <div className={s['user-info']}>
      {error && <div className="form-error">{error}</div>}
      <div className={s['user-avatar-container']}>
        <img
          className={s['user-avatar']}
          src={user.avatar || defaultAvatar}
          alt=""
          width="96"
          height="96"
        />
        <FilePicker
          accept={'image/*'}
          className={s['upload-photo-button']}
          ariaLabel={'Change photo'}
          disabled={isLoading}
          onSelect={handleAvatarSelect}
        >
          <IconSvg src={photoIcon} size={18} />
        </FilePicker>
      </div>
      <EditableText
        text={user.name}
        inputLabel={'Name'}
        inputName={'name'}
        disabled={isLoading}
        onSave={handleSaveName}
      />
      <p className={s['user-email']}>{user.email}</p>
    </div>
  );
};
