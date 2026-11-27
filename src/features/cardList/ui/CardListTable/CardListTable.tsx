import type { FC } from 'react';
import type { Card } from '../../../../main/types/card';
import { formatDate } from '../../../../utils/formatDate';
import { getCardType } from '../../../../utils/getCardType';
import Button from '../../../../main/ui/common/components/Button/Button';
import ButtonSort from '../../../../main/ui/common/components/ButtonSort/ButtonSort';
import Grade from '../../../../main/ui/common/components/Grade/Grade';
import { IconSvg } from '../../../../main/ui/common/components/IconSvg/IconSvg';
import editIcon from '../../../../assets/icons/edit.svg';
import deleteIcon from '../../../../assets/icons/trash.svg';
import s from './CardListTable.module.css';

type CardListTableProps = {
  cards: Card[];
  sortCards: string;
  isAuthUserPack: boolean;
  onSortChange: (sortCards: string) => void;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
};

const QuestionCell: FC<{ card: Card }> = ({ card }) => {
  switch (getCardType(card)) {
    case 'image':
      return <img className={s['card-image']} src={card.questionImg} alt="Question" />;
    case 'video':
      return (
        <span className={s['video-thumbnail']}>
          <img className={s['card-image']} src={card.questionImg} alt="Question video" />
        </span>
      );
    default:
      return card.question;
  }
};

export const CardListTable: FC<CardListTableProps> = ({
  cards,
  sortCards,
  isAuthUserPack,
  onSortChange,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="table">
      <thead className="table-head">
        <tr>
          <th className={s['question-col']}>
            <ButtonSort
              sortParam={'question'}
              currentSorting={sortCards}
              onSortClick={onSortChange}
            >
              Question
            </ButtonSort>
          </th>
          <th className={s['answer-col']}>
            <ButtonSort
              sortParam={'answer'}
              currentSorting={sortCards}
              onSortClick={onSortChange}
            >
              Answer
            </ButtonSort>
          </th>
          <th className={s['updated-col']}>
            <ButtonSort
              sortParam={'updated'}
              currentSorting={sortCards}
              onSortClick={onSortChange}
            >
              Last Updated
            </ButtonSort>
          </th>
          <th>
            <ButtonSort
              sortParam={'grade'}
              currentSorting={sortCards}
              onSortClick={onSortChange}
            >
              Grade
            </ButtonSort>
          </th>
          {isAuthUserPack && <th></th>}
        </tr>
      </thead>
      <tbody className="table-body">
        {cards.map((card) => (
          <tr key={card._id}>
            <td>
              <QuestionCell card={card} />
            </td>
            <td>{card.answer}</td>
            <td>{formatDate(card.updated)}</td>
            <td>
              <Grade value={card.grade} />
            </td>
            {isAuthUserPack && (
              <td>
                <div className="table-actions">
                  <Button aria-label={'Edit card'} onClick={() => onEdit(card)}>
                    <IconSvg src={editIcon} size={16} />
                  </Button>
                  <Button aria-label={'Delete card'} onClick={() => onDelete(card)}>
                    <IconSvg src={deleteIcon} size={16} />
                  </Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
