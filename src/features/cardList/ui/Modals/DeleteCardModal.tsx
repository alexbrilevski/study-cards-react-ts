import type { FC } from 'react';
import type { Card } from '../../../../main/types/card';
import { ModalWindow } from '../../../../main/ui/common/components/ModalWindow/ModalWindow';
import Button from '../../../../main/ui/common/components/Button/Button';

type DeleteCardModalProps = {
  show: boolean;
  title: string;
  card: Card;
  onCloseModal: (show: boolean) => void;
  onConfirmDelete: (id: string) => void;
};

export const DeleteCardModal: FC<DeleteCardModalProps> = ({
  show,
  title,
  card,
  onCloseModal,
  onConfirmDelete,
}) => {
  const handleConfirmDelete = () => {
    onConfirmDelete(card._id);
    onCloseModal(false);
  };

  const handleCloseModal = () => {
    onCloseModal(false);
  };

  return (
    <ModalWindow show={show} title={title} handleCloseModal={handleCloseModal}>
      <p className="modal-text">
        Do you really want to remove card <b>"{card.question}"</b>?
      </p>
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
