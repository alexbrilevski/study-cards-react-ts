import type { FC } from 'react';
import type { Pack } from '../../../../main/types/pack';
import { ModalWindow } from '../../../../main/ui/common/components/ModalWindow/ModalWindow';
import Button from '../../../../main/ui/common/components/Button/Button';

type DeleteCardPackModalProps = {
  show: boolean;
  title: string;
  pack: Pack;
  onCloseModal: (show: boolean) => void;
  onConfirmDelete: (id: string) => void;
};

export const DeleteCardPackModal: FC<DeleteCardPackModalProps> = ({
  show,
  title,
  pack,
  onCloseModal,
  onConfirmDelete,
}) => {
  const handleDeletePack = () => {
    onConfirmDelete(pack._id);
    onCloseModal(false);
  };

  const handleCloseModal = () => {
    onCloseModal(false);
  };

  return (
    <ModalWindow title={title} show={show} handleCloseModal={handleCloseModal}>
      <p className="modal-text">
        Do you really want to remove <b>{pack.name}</b>?<br />
        All it's cards will be deleted as well.
      </p>
      <div className="modal-actions">
        <Button variant={'contained'} color={'white'} onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant={'contained'} color={'red'} onClick={handleDeletePack}>
          Delete
        </Button>
      </div>
    </ModalWindow>
  );
};
