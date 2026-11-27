import { useRef, type ChangeEvent, type FC, type PropsWithChildren } from 'react';

type FilePickerProps = PropsWithChildren<{
  accept: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  onSelect: (file: File) => void;
}>;

export const FilePicker: FC<FilePickerProps> = ({
  accept,
  className,
  ariaLabel,
  disabled,
  onSelect,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = '';
    if (file) onSelect(file);
  };

  return (
    <>
      <button
        type={'button'}
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </button>
      <input
        ref={inputRef}
        type={'file'}
        accept={accept}
        hidden
        onChange={handleChange}
      />
    </>
  );
};
