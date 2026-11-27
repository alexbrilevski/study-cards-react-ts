import { useState, type FC } from 'react';
import { useFormik } from 'formik';
import InputText from '../../../../main/ui/common/components/InputText/InputText';
import Checkbox from '../../../../main/ui/common/components/Checkbox/Checkbox';
import Button from '../../../../main/ui/common/components/Button/Button';
import { MediaField } from '../../../../main/ui/common/components/MediaField/MediaField';
import { resizeImage } from '../../../../utils/media';

const COVER_SIZE = 600;

export type CardPackFormData = {
  name: string;
  isPrivate: boolean;
  deckCover: string;
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
  const [coverError, setCoverError] = useState<string>('');
  const packForm = useFormik({
    initialValues: {
      name: initValues ? initValues.name : '',
      isPrivate: initValues ? initValues.isPrivate : false,
      deckCover: initValues ? initValues.deckCover : '',
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

  const handleCoverSelect = async (file: File) => {
    setCoverError('');

    try {
      packForm.setFieldValue('deckCover', await resizeImage(file, COVER_SIZE));
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : 'The image could not be uploaded');
    }
  };

  return (
    <form onSubmit={packForm.handleSubmit}>
      <MediaField
        label={'Cover'}
        changeLabel={'Change cover'}
        placeholder={'No cover'}
        accept={'image/*'}
        value={packForm.values.deckCover}
        error={coverError}
        onSelect={handleCoverSelect}
      />
      <InputText
        label={'Pack name'}
        error={packForm.errors.name && packForm.touched.name ? packForm.errors.name : ''}
        {...packForm.getFieldProps('name')}
      />
      <Checkbox {...packForm.getFieldProps({ name: 'isPrivate', type: 'checkbox' })}>
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
