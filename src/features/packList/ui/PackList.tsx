import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../main/bll/store';
import { useDebouncedCallback } from '../../../utils/hooks/useDebouncedCallback';
import type { User } from '../../../main/types/user';
import type { Pack } from '../../../main/types/pack';
import {
  addPack,
  deletePack,
  editPack,
  fetchPackList,
  setPackListParams,
} from '../bll/packListReducer';
import { PATH } from '../../../main/ui/Main/Pages';
import Button from '../../../main/ui/common/components/Button/Button';
import { PackListHeader } from './PackListHeader/PackListHeader';
import { PackListTable } from './PackListTable/PackListTable';
import { Pagination } from '../../../main/ui/common/components/Pagination/Pagination';
import { CardPackFormModal } from './Modals/CardPackFormModal';
import type { CardPackFormData } from './Modals/PackForm';
import { DeleteCardPackModal } from './Modals/DeleteCardPackModal';

export type CardsPackListView = 'my' | 'all';

export const PackList = () => {
  const [showAddPackModal, setShowAddPackModal] = useState<boolean>(false);
  const [showEditPackModal, setShowEditPackModal] = useState<boolean>(false);
  const [showDeletePackModal, setShowDeletePackModal] = useState<boolean>(false);
  const [selectedCardPack, setSelectedCardPack] = useState<Pack | null>(null);
  const [cardPackFormValues, setCardPackFormValues] = useState<CardPackFormData>({
    name: '',
    isPrivate: false,
  });

  const authUser = useAppSelector<User | null>((state) => state.profile.user);
  const cardPacks = useAppSelector<Pack[]>((state) => state.packList.cardPacks);
  const minCardsCount = useAppSelector<number>((state) => state.packList.minCardsCount);
  const maxCardsCount = useAppSelector<number>((state) => state.packList.maxCardsCount);
  const min = useAppSelector<number | undefined>((state) => state.packList.params.min);
  const max = useAppSelector<number | undefined>((state) => state.packList.params.max);
  const packName = useAppSelector<string | undefined>(
    (state) => state.packList.params.packName,
  );
  const user_id = useAppSelector<string | undefined>(
    (state) => state.packList.params.user_id,
  );
  const sortPacks = useAppSelector<string>((state) => state.packList.params.sortPacks);
  const page = useAppSelector<number>((state) => state.packList.params.page);
  const pageSize = useAppSelector<number>((state) => state.packList.params.pageCount);
  const totalPacksCount = useAppSelector<number>(
    (state) => state.packList.cardPacksTotalCount,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPackList());
  }, [page, pageSize, packName, user_id, min, max, sortPacks]);

  const handleAddPackClick = () => {
    setCardPackFormValues({ name: '', isPrivate: false });
    setShowAddPackModal(true);
  };

  const handleAddNewPack = (cardPack: CardPackFormData) => {
    dispatch(addPack(cardPack));
  };

  const handleEditPackClick = (pack: Pack) => {
    setSelectedCardPack(pack);
    setCardPackFormValues({ name: pack.name, isPrivate: pack.private });
    setShowEditPackModal(true);
  };

  const handleEditPack = (cardPackData: CardPackFormData) => {
    if (selectedCardPack) {
      dispatch(
        editPack({
          _id: selectedCardPack._id,
          ...cardPackData,
          private: cardPackData.isPrivate,
        }),
      );
    }
  };

  const handleDeletePackClick = (pack: Pack) => {
    setSelectedCardPack(pack);
    setShowDeletePackModal(true);
  };

  const handleDeletePack = () => {
    if (selectedCardPack) {
      dispatch(deletePack(selectedCardPack._id));
    }
  };

  const setPackNameSearchParam = useDebouncedCallback((packName: string) => {
    dispatch(setPackListParams({ packName }));
  }, 500);

  const setPackListView = (view: CardsPackListView) => {
    dispatch(setPackListParams({ user_id: view === 'my' ? authUser?._id : undefined }));
  };

  const setCardsCountRange = useDebouncedCallback(([min, max]: [number, number]) => {
    dispatch(setPackListParams({ min, max }));
  }, 500);

  const resetPackListFilters = () => {
    dispatch(
      setPackListParams({
        packName: undefined,
        min: undefined,
        max: undefined,
        user_id: undefined,
      }),
    );
  };

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPackListParams({ page: pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setPackListParams({ pageCount: pageSize }));
  };

  if (!authUser) {
    return <Navigate to={PATH.LOGIN} />;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-main">
          <h1>Pack list</h1>
          <Button variant={'contained'} color={'primary'} onClick={handleAddPackClick}>
            Add new pack
          </Button>
        </div>
      </div>
      <>
        <PackListHeader
          packName={packName !== undefined ? packName : ''}
          min={min !== undefined ? min : minCardsCount}
          max={max !== undefined ? max : maxCardsCount}
          minCardsCount={minCardsCount}
          maxCardsCount={maxCardsCount}
          userId={user_id !== undefined ? user_id : ''}
          onSearchByPackName={setPackNameSearchParam}
          onSelectPackListView={setPackListView}
          onCardsCountRangeChange={setCardsCountRange}
          onClearFilters={resetPackListFilters}
        />
        {cardPacks.length !== 0 ? (
          <>
            <PackListTable
              packs={cardPacks}
              authUserId={authUser._id}
              sortPacks={sortPacks}
              handleEditPackClick={handleEditPackClick}
              handleDeletePackClick={handleDeletePackClick}
            />
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={totalPacksCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : (
          <p className="no-content-text caption text-center">
            No card packs found. Click "Add new pack" to create a new pack or change list
            filters.
          </p>
        )}
      </>
      <CardPackFormModal
        show={showAddPackModal}
        title={'Add new pack'}
        onCloseModal={setShowAddPackModal}
        onSubmitForm={handleAddNewPack}
      />
      <CardPackFormModal
        show={showEditPackModal}
        title={'Edit pack'}
        initValues={cardPackFormValues}
        onCloseModal={setShowEditPackModal}
        onSubmitForm={handleEditPack}
      />
      {selectedCardPack && (
        <DeleteCardPackModal
          show={showDeletePackModal}
          title={'Delete pack'}
          pack={selectedCardPack}
          onCloseModal={setShowDeletePackModal}
          onConfirmDelete={handleDeletePack}
        />
      )}
    </>
  );
};
