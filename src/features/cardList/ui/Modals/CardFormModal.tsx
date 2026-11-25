import type { FC } from 'react';
import { CardForm, type CardFormData } from './CardForm';
import { ModalWindow } from '../../../../main/ui/common/components/ModalWindow/ModalWindow';

type CardFormModalProps = {
  show: boolean;
  title: string;
  initValues?: CardFormData;
  onCloseModal: () => void;
  onSubmitForm: (cardFormData: CardFormData) => void;
};

export const CardFormModal: FC<CardFormModalProps> = ({
  show,
  title,
  initValues,
  onCloseModal,
  onSubmitForm,
}) => {
  const handleSubmitForm = (cardFormData: CardFormData) => {
    onSubmitForm(cardFormData);
    onCloseModal();
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  return (
    <ModalWindow title={title} show={show} handleCloseModal={handleCloseModal}>
      <CardForm
        initValues={initValues}
        onSave={handleSubmitForm}
        onCancel={handleCloseModal}
      />
    </ModalWindow>
  );
};
