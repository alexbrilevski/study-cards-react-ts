import type { FC } from 'react';
import { useFormik } from 'formik';
import InputText from '../../../../main/ui/common/components/InputText/InputText';
import Checkbox from '../../../../main/ui/common/components/Checkbox/Checkbox';
import Button from '../../../../main/ui/common/components/Button/Button';

export type CardPackFormData = {
  name: string;
  isPrivate: boolean;
};

type PackFormErrors = {
  name?: string;
};

type PackFormProps = {
  initValues?: CardPackFormData;
  onSave: (formData: CardPackFormData) => void;
  onCancel: () => void;
};

export const PackForm: FC<PackFormProps> = ({ initValues, onSave, onCancel }) => {
  const packForm = useFormik({
    initialValues: {
      name: initValues ? initValues.name : '',
      isPrivate: initValues ? initValues.isPrivate : false,
    },
    validate: (values) => {
      const errors: PackFormErrors = {};

      if (!values.name) {
        errors.name = 'Required';
      }

      return errors;
    },
    onSubmit(values) {
      onSave(values);
    },
  });

  return (
    <form onSubmit={packForm.handleSubmit}>
      <InputText
        label={'Pack name'}
        error={packForm.errors.name && packForm.errors.name ? packForm.errors.name : ''}
        {...packForm.getFieldProps('name')}
      />
      <Checkbox
        checked={packForm.values.isPrivate}
        {...packForm.getFieldProps('isPrivate')}
      >
        Private pack
      </Checkbox>
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
