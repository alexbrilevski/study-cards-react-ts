import type { FC } from 'react';
import { ModalWindow } from '../../../../main/ui/common/components/ModalWindow/ModalWindow';
import { PackForm, type CardPackFormData } from './PackForm';

type CardPackFormModalProps = {
  show: boolean;
  title: string;
  initValues?: CardPackFormData;
  onCloseModal: () => void;
  onSubmitForm: (cardPackData: CardPackFormData) => void;
};

export const CardPackFormModal: FC<CardPackFormModalProps> = ({
  show,
  title,
  initValues,
  onCloseModal,
  onSubmitForm,
}) => {
  const handleSubmitForm = (cardPackData: CardPackFormData) => {
    onSubmitForm(cardPackData);
    onCloseModal();
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  return (
    <ModalWindow title={title} show={show} handleCloseModal={handleCloseModal}>
      <PackForm
        initValues={initValues}
        onSave={handleSubmitForm}
        onCancel={handleCloseModal}
      />
    </ModalWindow>
  );
};
