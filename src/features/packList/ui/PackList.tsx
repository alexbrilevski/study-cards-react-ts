import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../main/bll/store';
import { useDebouncedCallback } from '../../../utils/hooks/useDebouncedCallback';
import type { Pack } from '../../../main/types/pack';
import {
  addPack,
  deletePack,
  editPack,
  fetchPackList,
  setPackListParams,
} from '../bll/packListReducer';
import Button from '../../../main/ui/common/components/Button/Button';
import { PackListHeader } from './PackListHeader/PackListHeader';
import { PackListTable } from './PackListTable/PackListTable';
import { Pagination } from '../../../main/ui/common/components/Pagination/Pagination';
import { CardPackFormModal } from './Modals/CardPackFormModal';
import type { CardPackFormData } from './Modals/PackForm';
import { DeleteItemModal } from '../../../main/ui/common/components/DeleteItemModal/DeleteItemModal';

export type CardsPackListView = 'my' | 'all';

type PackListModal =
  | { type: 'add' }
  | { type: 'edit'; pack: Pack }
  | { type: 'delete'; pack: Pack }
  | null;

export const PackList = () => {
  const [modal, setModal] = useState<PackListModal>(null);

  const authUser = useAppSelector((state) => state.profile.user);
  const cardPacks = useAppSelector((state) => state.packList.cardPacks);
  const minCardsCount = useAppSelector((state) => state.packList.minCardsCount);
  const maxCardsCount = useAppSelector((state) => state.packList.maxCardsCount);
  const min = useAppSelector((state) => state.packList.params.min);
  const max = useAppSelector((state) => state.packList.params.max);
  const packName = useAppSelector((state) => state.packList.params.packName);
  const user_id = useAppSelector((state) => state.packList.params.user_id);
  const sortPacks = useAppSelector((state) => state.packList.params.sortPacks);
  const page = useAppSelector((state) => state.packList.params.page);
  const pageSize = useAppSelector((state) => state.packList.params.pageCount);
  const totalPacksCount = useAppSelector((state) => state.packList.cardPacksTotalCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchPackList(controller.signal));

    return () => controller.abort();
  }, [page, pageSize, packName, user_id, min, max, sortPacks, dispatch]);

  const handleCloseModal = () => {
    setModal(null);
  };

  const handleAddPackClick = () => {
    setModal({ type: 'add' });
  };

  const handleAddNewPack = (cardPack: CardPackFormData) => {
    dispatch(addPack(cardPack));
  };

  const handleEditPackClick = (pack: Pack) => {
    setModal({ type: 'edit', pack });
  };

  const handleEditPack = (cardPackData: CardPackFormData) => {
    if (modal?.type !== 'edit') return;

    dispatch(
      editPack({
        _id: modal.pack._id,
        ...cardPackData,
        private: cardPackData.isPrivate,
      }),
    );
  };

  const handleDeletePackClick = (pack: Pack) => {
    setModal({ type: 'delete', pack });
  };

  const handleDeletePack = (id: string) => {
    dispatch(deletePack(id));
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
    return null;
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
          packName={packName ?? ''}
          min={min ?? minCardsCount}
          max={max ?? maxCardsCount}
          minCardsCount={minCardsCount}
          maxCardsCount={maxCardsCount}
          userId={user_id ?? ''}
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
        show={modal?.type === 'add'}
        title={'Add new pack'}
        onCloseModal={handleCloseModal}
        onSubmitForm={handleAddNewPack}
      />
      {modal?.type === 'edit' && (
        <CardPackFormModal
          show
          title={'Edit pack'}
          initValues={{ name: modal.pack.name, isPrivate: modal.pack.private }}
          onCloseModal={handleCloseModal}
          onSubmitForm={handleEditPack}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteItemModal
          show
          title={'Delete pack'}
          itemId={modal.pack._id}
          onCloseModal={handleCloseModal}
          onConfirmDelete={handleDeletePack}
        >
          Do you really want to remove <b>{modal.pack.name}</b>?<br />
          All it's cards will be deleted as well.
        </DeleteItemModal>
      )}
    </>
  );
};
