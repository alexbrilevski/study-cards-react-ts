import { useEffect, useState, type FC } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Card } from '../../../main/types/card';
import type { User } from '../../../main/types/user';
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
import { PATH } from '../../../main/ui/Main/Pages';
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

export const CardList: FC = () => {
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [showEditCardModal, setShowEditCardModal] = useState<boolean>(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState<boolean>(false);
  const [showEditCardPackModal, setShowEditCardPackModal] = useState<boolean>(false);
  const [showDeleteCardPackModal, setShowDeleteCardPackModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const { cardPackId } = useParams<'cardPackId'>();
  const authUser = useAppSelector<User | null>((state) => state.profile.user);
  const packName = useAppSelector<string>((state) => state.cardList.packName);
  const packPrivate = useAppSelector<boolean>((state) => state.cardList.packPrivate);
  const packDeleted = useAppSelector<boolean>((state) => state.cardList.packDeleted);
  const packUserId = useAppSelector<string>((state) => state.cardList.packUserId);
  const cards = useAppSelector<Card[]>((state) => state.cardList.cards);
  const cardQuestion = useAppSelector<string | undefined>(
    (state) => state.cardList.params.cardQuestion,
  );
  const sortCards = useAppSelector<string>((state) => state.cardList.params.sortCards);
  const page = useAppSelector<number>((state) => state.cardList.params.page);
  const pageSize = useAppSelector<number>((state) => state.cardList.params.pageCount);
  const cardsTotalCount = useAppSelector<number>(
    (state) => state.cardList.cardsTotalCount,
  );
  const isAuthUserPack = packUserId === authUser?._id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cardPackFormValues = { name: packName, isPrivate: packPrivate };
  let cardFormValues = null;

  useEffect(() => {
    if (!cardPackId) return;

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

  const handleAddCardClick = () => {
    setShowAddCardModal(true);
  };

  const handleAddCard = (cardFormData: CardFormData) => {
    dispatch(
      addCard({
        cardsPack_id: cardPackId as string,
        ...cardFormData,
      }),
    );
  };

  const handleEditCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowEditCardModal(true);
  };

  const handleEditCard = (cardFormData: CardFormData) => {
    if (selectedCard) {
      dispatch(editCard({ _id: selectedCard._id, ...cardFormData }));
    }
  };

  const handleDeleteCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowDeleteCardModal(true);
  };

  const handleDeleteCard = (id: string) => {
    dispatch(deleteCard(id));
  };

  const handleEditCardPackClick = () => {
    setShowEditCardPackModal(true);
  };

  const handleEditCardPack = (cardPackFormData: CardPackFormData) => {
    dispatch(
      editCurrentCardPack({
        _id: cardPackId as string,
        ...cardPackFormData,
        private: cardPackFormData.isPrivate,
      }),
    );
  };

  const handleDeleteCardPackClick = () => {
    setShowDeleteCardPackModal(true);
  };

  const handleDeleteCardPack = () => {
    dispatch(deleteCurrentCardPack(cardPackId as string));
  };

  const handleLearnCardPack = () => {
    navigate(`${PATH.LEARN}/${cardPackId}`);
  };

  const setCardQuestionSearchParam = useDebouncedCallback((value: string) => {
    dispatch(setCardListParams({ cardQuestion: value }));
  }, 500);

  const setCardListPage = (page: number) => {
    dispatch(setCardListParams({ page }));
  };

  const setCardListPageSize = (pageSize: number) => {
    dispatch(setCardListParams({ pageCount: pageSize }));
  };

  if (selectedCard) {
    cardFormValues = {
      question: selectedCard.question,
      answer: selectedCard.answer,
    };
  }

  if (packDeleted) {
    return <Navigate to={PATH.PACK_LIST} />;
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
            handleEditCardClick={handleEditCardClick}
            handleDeleteCardClick={handleDeleteCardClick}
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
        show={showAddCardModal}
        onCloseModal={setShowAddCardModal}
        onSubmitForm={handleAddCard}
      />
      {cardFormValues && (
        <CardFormModal
          title={'Edit card'}
          show={showEditCardModal}
          initValues={cardFormValues}
          onCloseModal={setShowEditCardModal}
          onSubmitForm={handleEditCard}
        />
      )}
      {selectedCard && (
        <DeleteItemModal
          title={'Delete card'}
          show={showDeleteCardModal}
          itemId={selectedCard._id}
          onCloseModal={setShowDeleteCardModal}
          onConfirmDelete={handleDeleteCard}
        >
          Do you really want to remove card <b>"{selectedCard.question}"</b>?
        </DeleteItemModal>
      )}
      <CardPackFormModal
        title={'Edit card pack'}
        show={showEditCardPackModal}
        initValues={cardPackFormValues}
        onCloseModal={setShowEditCardPackModal}
        onSubmitForm={handleEditCardPack}
      />
      <DeleteItemModal
        title={'Delete card pack'}
        show={showDeleteCardPackModal}
        itemId={cardPackId as string}
        onCloseModal={setShowDeleteCardPackModal}
        onConfirmDelete={handleDeleteCardPack}
      >
        Do you really want to remove <b>{packName}</b>?<br />
        All it's cards will be deleted as well.
      </DeleteItemModal>
    </>
  );
};
