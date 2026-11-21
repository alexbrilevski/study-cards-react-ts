import {
  useId,
  useRef,
  useState,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { NavLink } from 'react-router-dom';
import { useClickOutside } from '../../../../../utils/hooks/useClickOutside';
import { IconSvg } from '../IconSvg/IconSvg';
import s from './DropdownMenu.module.css';

export type DropdownMenuItem = {
  key: string;
  label: string;
  icon: string;
} & ({ onSelect: () => void } | { to: string });

type DropdownMenuProps = {
  trigger: ReactNode;
  triggerLabel?: string;
  items: DropdownMenuItem[];
  iconSize?: number;
  className?: string;
};

export const DropdownMenu: FC<DropdownMenuProps> = ({
  trigger,
  triggerLabel,
  items,
  iconSize = 16,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownId = useId();

  const close = () => setIsExpanded(false);

  useClickOutside(menuRef, close, isExpanded);

  const handleTriggerClick = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && isExpanded) {
      close();
      triggerRef.current?.focus();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    // relatedTarget is null when focus goes nowhere (e.g. a click on a non-focusable
    // area, or Safari not focusing clicked buttons) - that case is covered by
    // useClickOutside, so only react to focus actually moving to another element.
    const nextFocused = e.relatedTarget;
    if (nextFocused && !e.currentTarget.contains(nextFocused)) {
      close();
    }
  };

  const renderItemContent = (item: DropdownMenuItem) => (
    <>
      <IconSvg src={item.icon} size={iconSize} />
      <span>{item.label}</span>
    </>
  );

  return (
    <div
      ref={menuRef}
      className={className ? `${s['dropdown-menu']} ${className}` : s['dropdown-menu']}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        className={s['dropdown-control']}
        aria-label={triggerLabel}
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? dropdownId : undefined}
        onClick={handleTriggerClick}
      >
        {trigger}
      </button>
      {isExpanded && (
        <div id={dropdownId} className={s['dropdown']}>
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                {'to' in item ? (
                  <NavLink to={item.to} onClick={close}>
                    {renderItemContent(item)}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      item.onSelect();
                    }}
                  >
                    {renderItemContent(item)}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
