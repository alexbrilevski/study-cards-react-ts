import type { FC } from 'react';
import { FilePicker } from '../FilePicker/FilePicker';
import s from './MediaField.module.css';

type MediaFieldProps = {
  label: string;
  changeLabel: string;
  placeholder: string;
  accept: string;
  value: string;
  error?: string;
  onSelect: (file: File) => void;
};

export const MediaField: FC<MediaFieldProps> = ({
  label,
  changeLabel,
  placeholder,
  accept,
  value,
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
      {value ? (
        <img className={s['preview']} src={value} alt="" />
      ) : (
        <div className={s['placeholder']}>{placeholder}</div>
      )}
      {error && <span className={s['error']}>{error}</span>}
    </div>
  );
};
