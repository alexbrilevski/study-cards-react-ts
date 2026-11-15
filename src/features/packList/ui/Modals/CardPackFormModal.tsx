import type { FC } from 'react';
import { ModalWindow } from '../../../../main/ui/common/components/ModalWindow/ModalWindow';
import { PackForm, type CardPackFormData } from './PackForm';

type CardPackFormModalProps = {
  show: boolean;
  onCloseModal: (show: boolean) => void;
  onSubmitForm: (cardPackData: CardPackFormData) => void;
};

export const CardPackFormModal: FC<CardPackFormModalProps> = ({
  show,
  onCloseModal,
  onSubmitForm,
}) => {
  const handleSublitForm = (cardPackData: CardPackFormData) => {
    onSubmitForm(cardPackData);
    onCloseModal(false);
  };

  const handleCloseModal = () => {
    onCloseModal(false);
  };

  return (
    <ModalWindow title={'Add new pack'} show={show} handleCloseModal={handleCloseModal}>
      <PackForm onSave={handleSublitForm} onCancel={handleCloseModal} />
    </ModalWindow>
  );
};
