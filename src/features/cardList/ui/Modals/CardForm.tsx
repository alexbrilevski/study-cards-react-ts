import { useFormik } from 'formik';
import type { FC } from 'react';
import InputText from '../../../../main/ui/common/components/InputText/InputText';
import Button from '../../../../main/ui/common/components/Button/Button';

export type CardFormData = {
  question: string;
  answer: string;
};

type CardFormErrors = {
  question?: string;
  answer?: string;
};

type CardFormProps = {
  initValues?: CardFormData;
  onSave: (cardFormData: CardFormData) => void;
  onCancel: () => void;
};

export const CardForm: FC<CardFormProps> = ({ initValues, onSave, onCancel }) => {
  const cardForm = useFormik({
    initialValues: {
      question: initValues ? initValues.question : '',
      answer: initValues ? initValues.answer : '',
    },
    validate: (values) => {
      const errors: CardFormErrors = {};

      if (!values.question) {
        errors.question = 'Required';
      }

      if (!values.answer) {
        errors.answer = 'Required';
      }

      return errors;
    },
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <form onSubmit={cardForm.handleSubmit}>
      <InputText
        label={'Question'}
        error={
          cardForm.errors.question && cardForm.touched.question
            ? cardForm.errors.question
            : ''
        }
        {...cardForm.getFieldProps('question')}
      />
      <InputText
        label={'Answer'}
        error={
          cardForm.errors.answer && cardForm.touched.answer ? cardForm.errors.answer : ''
        }
        {...cardForm.getFieldProps('answer')}
      />
      <div className="modal-actions">
        <Button variant={'contained'} color={'white'} type={'button'} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={'contained'} color={'primary'} type={'submit'}>
          Save
        </Button>
      </div>
    </form>
  );
};
