import { useEffect, useState, type FC } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Card } from '../../../main/types/card';
import { useAppDispatch, useAppSelector } from '../../../main/bll/store';
import {
  addCard,
  deleteCard,
  deleteCurrentCardPack,
  editCard,
  editCurrentCardPack,
  fetchCardList,
  resetCardListState,
  setCardListParams,
} from '../bll/cardListReducer';
import { useDebouncedCallback } from '../../../utils/hooks/useDebouncedCallback';
import { PATH } from '../../../main/ui/Main/paths';
import ButtonBack from '../../../main/ui/common/components/ButtonBack/ButtonBack';
import Button from '../../../main/ui/common/components/Button/Button';
import SearchField from '../../../main/ui/common/components/SearchField/SearchField';
import { CardPackMenu } from '../../../main/ui/common/components/CardPackMenu/CardPackMenu';
import { CardListTable } from './CardListTable/CardListTable';
import { Pagination } from '../../../main/ui/common/components/Pagination/Pagination';
import type { CardFormData } from './Modals/CardForm';
import { CardFormModal } from './Modals/CardFormModal';
import { DeleteItemModal } from '../../../main/ui/common/components/DeleteItemModal/DeleteItemModal';
import { CardPackFormModal } from '../../packList/ui/Modals/CardPackFormModal';
import type { CardPackFormData } from '../../packList/ui/Modals/PackForm';
import s from './CardList.module.css';

type CardListModal =
  | { type: 'add-card' }
  | { type: 'edit-card'; card: Card }
  | { type: 'delete-card'; card: Card }
  | { type: 'edit-pack' }
  | { type: 'delete-pack' }
  | null;

export const CardList: FC = () => {
  const { cardPackId } = useParams<'cardPackId'>();

  if (!cardPackId) {
    return <Navigate to={PATH.PACK_LIST} replace />;
  }

  return <CardListPage key={cardPackId} cardPackId={cardPackId} />;
};

type CardListPageProps = {
  cardPackId: string;
};

const CardListPage: FC<CardListPageProps> = ({ cardPackId }) => {
  const [modal, setModal] = useState<CardListModal>(null);

  const authUser = useAppSelector((state) => state.profile.user);
  const packName = useAppSelector((state) => state.cardList.packName);
  const packPrivate = useAppSelector((state) => state.cardList.packPrivate);
  const packDeckCover = useAppSelector((state) => state.cardList.packDeckCover);
  const packDeleted = useAppSelector((state) => state.cardList.packDeleted);
  const packUserId = useAppSelector((state) => state.cardList.packUserId);
  const cards = useAppSelector((state) => state.cardList.cards);
  const cardQuestion = useAppSelector((state) => state.cardList.params.cardQuestion);
  const sortCards = useAppSelector((state) => state.cardList.params.sortCards);
  const page = useAppSelector((state) => state.cardList.params.page);
  const pageSize = useAppSelector((state) => state.cardList.params.pageCount);
  const cardsTotalCount = useAppSelector((state) => state.cardList.cardsTotalCount);
  const isAuthUserPack = packUserId === authUser?._id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cardPackFormValues = {
    name: packName,
    isPrivate: packPrivate,
    deckCover: packDeckCover,
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCardList(cardPackId, controller.signal));

    return () => controller.abort();
  }, [cardPackId, cardQuestion, sortCards, page, pageSize, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCardListState());
    };
  }, [dispatch]);

  const handleGoBackClick = () => {
    navigate(-1);
  };

  const handleCloseModal = () => {
    setModal(null);
  };

  const handleAddCardClick = () => {
    setModal({ type: 'add-card' });
  };

  const handleAddCard = (cardFormData: CardFormData) => {
    dispatch(
      addCard({
        cardsPack_id: cardPackId,
        ...cardFormData,
      }),
    );
  };

  const handleEditCardClick = (card: Card) => {
    setModal({ type: 'edit-card', card });
  };

  const handleEditCard = (cardFormData: CardFormData) => {
    if (modal?.type !== 'edit-card') return;

    dispatch(editCard({ _id: modal.card._id, ...cardFormData }));
  };

  const handleDeleteCardClick = (card: Card) => {
    setModal({ type: 'delete-card', card });
  };

  const handleDeleteCard = (id: string) => {
    dispatch(deleteCard(id));
  };

  const handleEditCardPackClick = () => {
    setModal({ type: 'edit-pack' });
  };

  const handleEditCardPack = (cardPackFormData: CardPackFormData) => {
    dispatch(
      editCurrentCardPack({
        _id: cardPackId,
        ...cardPackFormData,
        private: cardPackFormData.isPrivate,
      }),
    );
  };

  const handleDeleteCardPackClick = () => {
    setModal({ type: 'delete-pack' });
  };

  const handleDeleteCardPack = () => {
    dispatch(deleteCurrentCardPack(cardPackId));
  };

  const handleLearnCardPack = () => {
    navigate(`${PATH.LEARN}/${cardPackId}`);
  };

  const setCardQuestionSearchParam = useDebouncedCallback((value: string) => {
    dispatch(setCardListParams({ cardQuestion: value }));
  }, 500);

  const setCardListSorting = (sortCards: string) => {
    dispatch(setCardListParams({ sortCards }));
  };

  const setCardListPage = (page: number) => {
    dispatch(setCardListParams({ page }));
  };

  const setCardListPageSize = (pageSize: number) => {
    dispatch(setCardListParams({ pageCount: pageSize }));
  };

  if (packDeleted) {
    return <Navigate to={PATH.PACK_LIST} replace />;
  }

  return (
    <>
      <div className="page-header">
        <ButtonBack onClick={handleGoBackClick} caption={'Back to Pack List'} />
        <div className="page-header-main">
          <div className="page-title-container">
            <h1>{packName}</h1>
            {isAuthUserPack && (
              <CardPackMenu
                isEmptyPack={cards.length === 0}
                onEdit={handleEditCardPackClick}
                onDelete={handleDeleteCardPackClick}
                onLearn={handleLearnCardPack}
              />
            )}
          </div>
          {cards.length !== 0 &&
            (isAuthUserPack ? (
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={handleAddCardClick}
              >
                Add new card
              </Button>
            ) : (
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={handleLearnCardPack}
              >
                Learn pack
              </Button>
            ))}
        </div>
        {packDeckCover && <img className={s['pack-cover']} src={packDeckCover} alt="" />}
      </div>
      <div className={s['card-list-header']}>
        <SearchField
          label={'Search by Question'}
          name={'cardListSearch'}
          placeholder={'Provide your text'}
          value={cardQuestion !== undefined ? cardQuestion : ''}
          onChangeValue={setCardQuestionSearchParam}
        />
      </div>
      {cards.length !== 0 ? (
        <>
          <CardListTable
            cards={cards}
            sortCards={sortCards}
            isAuthUserPack={isAuthUserPack}
            onSortChange={setCardListSorting}
            onEdit={handleEditCardClick}
            onDelete={handleDeleteCardClick}
          />
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalCount={cardsTotalCount}
            onPageChange={setCardListPage}
            onPageSizeChange={setCardListPageSize}
          />
        </>
      ) : (
        <div className="no-content-text caption text-center">
          <p>This pack is empty.</p>
          {isAuthUserPack && (
            <>
              <p>Click add new card to fill this pack.</p>
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={handleAddCardClick}
              >
                Add new card
              </Button>
            </>
          )}
        </div>
      )}
      <CardFormModal
        title={'Add new card'}
        show={modal?.type === 'add-card'}
        onCloseModal={handleCloseModal}
        onSubmitForm={handleAddCard}
      />
      {modal?.type === 'edit-card' && (
        <CardFormModal
          title={'Edit card'}
          show
          initValues={{
            type: modal.card.type,
            question: modal.card.question,
            answer: modal.card.answer,
            questionImg: modal.card.questionImg,
            questionVideo: modal.card.questionVideo,
          }}
          onCloseModal={handleCloseModal}
          onSubmitForm={handleEditCard}
        />
      )}
      {modal?.type === 'delete-card' && (
        <DeleteItemModal
          title={'Delete card'}
          show
          itemId={modal.card._id}
          onCloseModal={handleCloseModal}
          onConfirmDelete={handleDeleteCard}
        >
          Do you really want to remove card <b>"{modal.card.question}"</b>?
        </DeleteItemModal>
      )}
      <CardPackFormModal
        title={'Edit card pack'}
        show={modal?.type === 'edit-pack'}
        initValues={cardPackFormValues}
        onCloseModal={handleCloseModal}
        onSubmitForm={handleEditCardPack}
      />
      <DeleteItemModal
        title={'Delete card pack'}
        show={modal?.type === 'delete-pack'}
        itemId={cardPackId}
        onCloseModal={handleCloseModal}
        onConfirmDelete={handleDeleteCardPack}
      >
        Do you really want to remove <b>{packName}</b>?<br />
        All it's cards will be deleted as well.
      </DeleteItemModal>
    </>
  );
};
