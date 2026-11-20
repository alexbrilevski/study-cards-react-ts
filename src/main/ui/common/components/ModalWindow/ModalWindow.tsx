import type { FC, PropsWithChildren } from 'react';
import s from './ModalWindow.module.css';
import { IconSvg } from '../IconSvg/IconSvg';
import closeIcon from '../../../../../assets/icons/close.svg';

type ModalWindowProps = PropsWithChildren<{
  title?: string;
  show: boolean;
  handleCloseModal: () => void;
}>;

export const ModalWindow: FC<ModalWindowProps> = ({
  title,
  show,
  handleCloseModal,
  children,
}) => {
  if (!show) return;

  return (
    <>
      <div className={s['modal-overlay']} onClick={handleCloseModal}></div>
      <div className={s['modal']}>
        <div className={s['modal-header']}>
          {title && <h2 className={s['modal-title']}>{title}</h2>}
          <button className={s['close-button']} onClick={handleCloseModal}>
            <IconSvg src={closeIcon} className={s['icon']} size={14} />
          </button>
        </div>
        <div className={s['modal-content']}>{children}</div>
      </div>
    </>
  );
};
