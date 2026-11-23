import {
  useEffect,
  useId,
  useRef,
  type FC,
  type KeyboardEvent,
  type PropsWithChildren,
} from 'react';
import s from './ModalWindow.module.css';
import { IconSvg } from '../IconSvg/IconSvg';
import closeIcon from '../../../../../assets/icons/close.svg';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

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
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!show) return;

    const previouslyFocused = document.activeElement;
    const prevBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [show]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleCloseModal();
      return;
    }

    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === modalRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!show) return null;

  return (
    <>
      <div className={s['modal-overlay']} onClick={handleCloseModal}></div>
      <div
        ref={modalRef}
        className={s['modal']}
        role={'dialog'}
        aria-modal={'true'}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className={s['modal-header']}>
          {title && (
            <h2 id={titleId} className={s['modal-title']}>
              {title}
            </h2>
          )}
          <button
            type={'button'}
            className={s['close-button']}
            aria-label={'Close'}
            onClick={handleCloseModal}
          >
            <IconSvg src={closeIcon} className={s['icon']} size={14} />
          </button>
        </div>
        <div className={s['modal-content']}>{children}</div>
      </div>
    </>
  );
};
