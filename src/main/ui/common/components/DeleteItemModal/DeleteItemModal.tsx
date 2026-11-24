import type { FC, PropsWithChildren } from 'react';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import Button from '../Button/Button';

type DeleteItemModalProps = PropsWithChildren<{
  title: string;
  itemId: string;
  show: boolean;
  onConfirmDelete: (id: string) => void;
  onCloseModal: () => void;
}>;

export const DeleteItemModal: FC<DeleteItemModalProps> = ({
  title,
  itemId,
  show,
  onConfirmDelete,
  onCloseModal,
  children,
}) => {
  const handleConfirmDelete = () => {
    onConfirmDelete(itemId);
    onCloseModal();
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  return (
    <ModalWindow title={title} show={show} handleCloseModal={handleCloseModal}>
      <p className="modal-text">{children}</p>
      <div className="modal-actions">
        <Button variant={'contained'} color={'white'} onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant={'contained'} color={'red'} onClick={handleConfirmDelete}>
          Delete
        </Button>
      </div>
    </ModalWindow>
  );
};
