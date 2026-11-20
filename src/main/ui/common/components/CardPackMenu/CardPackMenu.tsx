import { useEffect, useRef, useState, type FC } from 'react';
import { IconSvg } from '../IconSvg/IconSvg';
import menuIcon from '../../../../../assets/icons/three-dots.svg';
import editIcon from '../../../../../assets/icons/edit.svg';
import deleteIcon from '../../../../../assets/icons/trash.svg';
import learnIcon from '../../../../../assets/icons/teacher.svg';
import s from './CardPackMenu.module.css';

type CardsPackMenuProps = {
  isEmptyPack: boolean;
  handleEditCardPack: () => void;
  handleDeleteCardPack: () => void;
  handleLearnCardPack: () => void;
};

export const CardPackMenu: FC<CardsPackMenuProps> = ({
  isEmptyPack,
  handleEditCardPack,
  handleDeleteCardPack,
  handleLearnCardPack,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isExpanded]);

  const handleExpandMenu = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleEditPackClick = () => {
    setIsExpanded(false);
    handleEditCardPack();
  };

  const handleDeletePackClick = () => {
    setIsExpanded(false);
    handleDeleteCardPack();
  };

  return (
    <div ref={menuRef} className={s['card-pack-menu']}>
      <button className={s['dropdown-control']} onClick={handleExpandMenu}>
        <IconSvg src={menuIcon} size={24} />
      </button>
      {isExpanded && (
        <div className={s['dropdown']}>
          <ul>
            <li>
              <button onClick={handleEditPackClick}>
                <IconSvg src={editIcon} size={24} />
                <span>Edit</span>
              </button>
            </li>
            <li>
              <button onClick={handleDeletePackClick}>
                <IconSvg src={deleteIcon} size={24} />
                <span>Delete</span>
              </button>
            </li>
            {!isEmptyPack && (
              <li>
                <button onClick={handleLearnCardPack}>
                  <IconSvg src={learnIcon} size={24} />
                  <span>Learn</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
