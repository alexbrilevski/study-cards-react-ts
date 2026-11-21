import type { FC } from 'react';
import { DropdownMenu, type DropdownMenuItem } from '../DropdownMenu/DropdownMenu';
import { IconSvg } from '../IconSvg/IconSvg';
import menuIcon from '../../../../../assets/icons/three-dots.svg';
import editIcon from '../../../../../assets/icons/edit.svg';
import deleteIcon from '../../../../../assets/icons/trash.svg';
import learnIcon from '../../../../../assets/icons/teacher.svg';
import s from './CardPackMenu.module.css';

type CardsPackMenuProps = {
  isEmptyPack: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onLearn: () => void;
};

export const CardPackMenu: FC<CardsPackMenuProps> = ({
  isEmptyPack,
  onEdit,
  onDelete,
  onLearn,
}) => {
  const items: DropdownMenuItem[] = [
    { key: 'edit', label: 'Edit', icon: editIcon, onSelect: onEdit },
    { key: 'delete', label: 'Delete', icon: deleteIcon, onSelect: onDelete },
  ];

  if (!isEmptyPack) {
    items.push({ key: 'learn', label: 'Learn', icon: learnIcon, onSelect: onLearn });
  }

  return (
    <DropdownMenu
      className={s['card-pack-menu']}
      items={items}
      iconSize={24}
      triggerLabel="Pack actions"
      trigger={<IconSvg src={menuIcon} size={24} />}
    />
  );
};
