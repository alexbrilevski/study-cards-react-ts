import type { FC } from 'react';
import s from './ProgressBar.module.css';

type ProgressBarProps = {
  active: boolean;
};

export const ProgressBar: FC<ProgressBarProps> = ({ active }) => {
  return (
    <div className={s['progress-bar']}>
      {active && (
        <div className={s['indicator']} role={'progressbar'} aria-label={'Loading'} />
      )}
    </div>
  );
};
