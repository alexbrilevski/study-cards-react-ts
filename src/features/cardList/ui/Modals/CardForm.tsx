import { useId, useState, type FC } from 'react';
import { useFormik } from 'formik';
import type { CardType } from '../../../../main/types/card';
import InputText from '../../../../main/ui/common/components/InputText/InputText';
import SelectField from '../../../../main/ui/common/components/SelectField/SelectField';
import { MediaField } from '../../../../main/ui/common/components/MediaField/MediaField';
import Button from '../../../../main/ui/common/components/Button/Button';
import { getCardType } from '../../../../utils/getCardType';
import { resizeImage } from '../../../../utils/media';
import s from './CardForm.module.css';

const CARD_IMAGE_SIZE = 800;

const QUESTION_FORMATS: Record<string, CardType> = {
  Text: 'text',
  Picture: 'image',
};

const MEDIA_QUESTION_TEXT: Record<Exclude<CardType, 'text'>, string> = {
  image: 'Image',
};

export type CardFormData = {
  type?: string;
  question: string;
  answer: string;
  questionImg?: string;
};

type CardFormValues = {
  type: CardType;
  question: string;
  answer: string;
  questionImg: string;
};

type CardFormErrors = Partial<Record<keyof CardFormValues, string>>;

type CardFormProps = {
  initValues?: CardFormData;
  onSave: (cardFormData: CardFormData) => void;
  onCancel: () => void;
};

export const CardForm: FC<CardFormProps> = ({ initValues, onSave, onCancel }) => {
  const formatSelectId = useId();
  const [imageError, setImageError] = useState('');

  const initType = getCardType({ type: initValues?.type });

  const cardForm = useFormik<CardFormValues>({
    initialValues: {
      type: initType,
      question: initType === 'text' ? (initValues?.question ?? '') : '',
      answer: initValues?.answer ?? '',
      questionImg: initValues?.questionImg ?? '',
    },
    validate: (values) => {
      const errors: CardFormErrors = {};

      if (values.type === 'text' && !values.question) errors.question = 'Required';
      if (values.type === 'image' && !values.questionImg) errors.questionImg = 'Required';
      if (!values.answer) errors.answer = 'Required';

      return errors;
    },
    onSubmit: ({ type, question, answer, questionImg }) => {
      if (type === 'text') {
        onSave({ type, question, answer });
      } else {
        onSave({ type, question: MEDIA_QUESTION_TEXT[type], answer, questionImg });
      }
    },
  });

  const currentFormat =
    Object.keys(QUESTION_FORMATS).find(
      (label) => QUESTION_FORMATS[label] === cardForm.values.type,
    ) ?? 'Text';

  const handleFormatChange = (label: string) => {
    cardForm.setFieldValue('type', QUESTION_FORMATS[label]);
  };

  const handleImageSelect = async (file: File) => {
    setImageError('');

    try {
      await cardForm.setFieldValue(
        'questionImg',
        await resizeImage(file, CARD_IMAGE_SIZE),
      );
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'The image could not be uploaded');
    }
  };

  const getFieldError = (field: keyof CardFormValues) =>
    cardForm.touched[field] && cardForm.errors[field] ? cardForm.errors[field] : '';

  return (
    <form onSubmit={cardForm.handleSubmit}>
      <div className={s['format-field']}>
        <label htmlFor={formatSelectId} className={s['format-label']}>
          Choose a question format
        </label>
        <SelectField
          id={formatSelectId}
          options={Object.keys(QUESTION_FORMATS)}
          value={currentFormat}
          onChangeOption={handleFormatChange}
        />
      </div>
      {cardForm.values.type === 'text' ? (
        <InputText
          label={'Question'}
          error={getFieldError('question')}
          {...cardForm.getFieldProps('question')}
        />
      ) : (
        <MediaField
          label={'Question:'}
          changeLabel={'Change image'}
          placeholder={'No image'}
          accept={'image/*'}
          value={cardForm.values.questionImg}
          error={imageError || getFieldError('questionImg')}
          onSelect={handleImageSelect}
        />
      )}
      <InputText
        label={'Answer'}
        error={getFieldError('answer')}
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
