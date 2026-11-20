import type { FC, PropsWithChildren } from 'react';
import { ModalWindow } from '../ModalWindow/ModalWindow';
import Button from '../Button/Button';

type DeleteItemModalProps = PropsWithChildren<{
  title: string;
  itemId: string;
  show: boolean;
  onConfirmDelete: (id: string) => void;
  onCloseModal: (show: boolean) => void;
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
    onCloseModal(false);
  };

  const handleCloseModal = () => {
    onCloseModal(false);
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
