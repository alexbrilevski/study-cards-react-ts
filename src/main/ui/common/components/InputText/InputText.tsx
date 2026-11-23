import {
  useId,
  useState,
  type ChangeEvent,
  type DetailedHTMLProps,
  type FC,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { IconSvg } from '../IconSvg/IconSvg';
import eyeIcon from '../../../../../assets/icons/eye.svg';
import eyeSlashIcon from '../../../../../assets/icons/eye-slash.svg';
import s from './InputText.module.css';

type DefaultInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type InputTextProps = DefaultInputProps & {
  onChangeText?: (value: string) => void;
  onEnter?: () => void;
  label?: string;
  error?: string;
  spanClassName?: string;
};

const InputText: FC<InputTextProps> = ({
  type,
  name,
  onChange,
  onFocus,
  onBlur,
  onChangeText,
  onKeyDown,
  onEnter,
  label,
  error,
  className,
  spanClassName,
  ...restProps
}) => {
  const [inputType, setInputType] = useState<string | undefined>(type);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputId = useId();
  const isActive = isFocused || Boolean(restProps.value);
  const isPasswordInput = type === 'password';

  const handleChangeInputType = () => {
    setInputType((prevType) => {
      if (isPasswordInput) {
        return prevType === 'password' ? 'text' : 'password';
      } else {
        return prevType;
      }
    });
  };

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onChangeText?.(e.currentTarget.value);
  };

  const onKeyDownCallback = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Enter') onEnter?.();
  };

  const onFocusCallback = (e: FocusEvent<HTMLInputElement>) => {
    onFocus?.(e);
    setIsFocused(true);
  };
  const onBlurCallback = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    setIsFocused(false);
  };

  const finalLabelClassName = `${s['label']} ${isActive ? s['active'] : ''}`;
  const finalInputClassName = `${s['input']} ${error ? s['input-error'] : ''} ${className ? className : ''}`;
  const finalSpanClassName = `${s['error']} ${spanClassName ? spanClassName : ''}`;

  return (
    <div className={s['form-group']}>
      {label && (
        <label htmlFor={inputId} className={finalLabelClassName}>
          {label}
        </label>
      )}
      <div className={s['form-control']}>
        <input
          id={inputId}
          name={name}
          type={inputType}
          onChange={onChangeCallback}
          onKeyDown={onKeyDownCallback}
          onFocus={onFocusCallback}
          onBlur={onBlurCallback}
          className={finalInputClassName}
          {...restProps}
        />
        {isPasswordInput && (
          <button
            type={'button'}
            className={s['toggle-button']}
            onClick={handleChangeInputType}
          >
            <IconSvg src={inputType === 'password' ? eyeIcon : eyeSlashIcon} size={24} />
          </button>
        )}
      </div>
      {error && <span className={finalSpanClassName}>{error}</span>}
    </div>
  );
};

export default InputText;
