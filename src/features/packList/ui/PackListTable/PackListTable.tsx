import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import type { Pack } from '../../../../main/types/pack';
import { PATH } from '../../../../main/ui/Main/paths';
import { formatDate } from '../../../../utils/formatDate';
import Button from '../../../../main/ui/common/components/Button/Button';
import ButtonSort from '../../../../main/ui/common/components/ButtonSort/ButtonSort';
import { IconSvg } from '../../../../main/ui/common/components/IconSvg/IconSvg';
import learnIcon from '../../../../assets/icons/teacher.svg';
import editIcon from '../../../../assets/icons/edit.svg';
import deleteIcon from '../../../../assets/icons/trash.svg';
import s from './PackListTable.module.css';

type PackListTableProps = {
  packs: Pack[];
  authUserId: string;
  sortPacks: string;
  onSortChange: (sortPacks: string) => void;
  onLearn: (pack: Pack) => void;
  onEdit: (pack: Pack) => void;
  onDelete: (pack: Pack) => void;
};

export const PackListTable: FC<PackListTableProps> = ({
  packs,
  authUserId,
  sortPacks,
  onSortChange,
  onLearn,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-head">
          <tr>
            <th className={s['name-col']}>
              <ButtonSort
                sortParam={'name'}
                currentSorting={sortPacks}
                onSortClick={onSortChange}
              >
                Name
              </ButtonSort>
            </th>
            <th className={s['cards-count-col']}>
              <ButtonSort
                sortParam={'cardsCount'}
                currentSorting={sortPacks}
                onSortClick={onSortChange}
              >
                Cards
              </ButtonSort>
            </th>
            <th className={s['updated-col']}>
              <ButtonSort
                sortParam={'updated'}
                currentSorting={sortPacks}
                onSortClick={onSortChange}
              >
                Last Updated
              </ButtonSort>
            </th>
            <th className={s['author-col']}>Created by</th>
            <th className={s['actions-col']}>Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {packs.map((pack) => {
            return (
              <tr key={pack._id}>
                <td>
                  <div className={s['pack-name']}>
                    {pack.deckCover ? (
                      <img className={s['pack-cover']} src={pack.deckCover} alt="" />
                    ) : (
                      <span className={`${s['pack-cover']} ${s['no-cover']}`}>
                        No cover
                      </span>
                    )}
                    <NavLink to={`${PATH.CARD_LIST}/${pack._id}`}>{pack.name}</NavLink>
                  </div>
                </td>
                <td>{pack.cardsCount}</td>
                <td>{formatDate(pack.updated)}</td>
                <td>{pack.user_name}</td>
                <td>
                  <div className="table-actions">
                    <Button
                      aria-label={`Learn ${pack.name}`}
                      onClick={() => onLearn(pack)}
                    >
                      <IconSvg src={learnIcon} size={16} />
                    </Button>
                    {pack.user_id === authUserId && (
                      <>
                        <Button
                          aria-label={`Edit ${pack.name}`}
                          onClick={() => onEdit(pack)}
                        >
                          <IconSvg src={editIcon} size={16} />
                        </Button>
                        <Button
                          aria-label={`Delete ${pack.name}`}
                          onClick={() => onDelete(pack)}
                        >
                          <IconSvg src={deleteIcon} size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
