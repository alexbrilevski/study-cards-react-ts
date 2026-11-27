import type { FC } from 'react';
import { FilePicker } from '../FilePicker/FilePicker';
import s from './MediaField.module.css';

type MediaFieldProps = {
  label: string;
  changeLabel: string;
  placeholder: string;
  accept: string;
  value: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  error?: string;
  onSelect: (file: File) => void;
};

export const MediaField: FC<MediaFieldProps> = ({
  label,
  changeLabel,
  placeholder,
  accept,
  value,
  mediaType = 'image',
  poster,
  error,
  onSelect,
}) => {
  return (
    <div className={s['media-field']}>
      <div className={s['media-field-header']}>
        <span className={s['label']}>{label}</span>
        <FilePicker
          accept={accept}
          className={s['change-button']}
          ariaLabel={`${changeLabel} (${label})`}
          onSelect={onSelect}
        >
          {changeLabel}
        </FilePicker>
      </div>
      {value && mediaType === 'video' && (
        <video className={s['preview']} src={value} poster={poster} controls />
      )}
      {value && mediaType === 'image' && (
        <img className={s['preview']} src={value} alt="" />
      )}
      {!value && <div className={s['placeholder']}>{placeholder}</div>}
      {error && <span className={s['error']}>{error}</span>}
    </div>
  );
};
