import { useId, useState, type FC } from 'react';
import { useFormik } from 'formik';
import type { CardType } from '../../../../main/types/card';
import InputText from '../../../../main/ui/common/components/InputText/InputText';
import SelectField from '../../../../main/ui/common/components/SelectField/SelectField';
import { MediaField } from '../../../../main/ui/common/components/MediaField/MediaField';
import Button from '../../../../main/ui/common/components/Button/Button';
import { getCardType } from '../../../../utils/getCardType';
import {
  captureVideoPoster,
  formatFileSize,
  getDataUrlSize,
  MAX_UPLOAD_SIZE,
  readFileAsDataUrl,
  resizeImage,
} from '../../../../utils/media';
import s from './CardForm.module.css';

const CARD_IMAGE_SIZE = 800;
const VIDEO_POSTER_SIZE = 480;

const QUESTION_FORMATS: Record<string, CardType> = {
  Text: 'text',
  Picture: 'image',
  Video: 'video',
};

const MEDIA_QUESTION_TEXT: Record<Exclude<CardType, 'text'>, string> = {
  image: 'Image',
  video: 'Video',
};

export type CardFormData = {
  type?: string;
  question: string;
  answer: string;
  questionImg?: string;
  questionVideo?: string;
};

type CardFormValues = {
  type: CardType;
  question: string;
  answer: string;
  questionImg: string;
  questionVideo: string;
};

type CardFormErrors = Partial<Record<keyof CardFormValues, string>>;

type CardFormProps = {
  initValues?: CardFormData;
  onSave: (cardFormData: CardFormData) => void;
  onCancel: () => void;
};

export const CardForm: FC<CardFormProps> = ({ initValues, onSave, onCancel }) => {
  const formatSelectId = useId();
  const [mediaError, setMediaError] = useState('');

  const initType = getCardType({ type: initValues?.type });

  const cardForm = useFormik<CardFormValues>({
    initialValues: {
      type: initType,
      question: initType === 'text' ? (initValues?.question ?? '') : '',
      answer: initValues?.answer ?? '',
      questionImg: initValues?.questionImg ?? '',
      questionVideo: initValues?.questionVideo ?? '',
    },
    validate: (values) => {
      const errors: CardFormErrors = {};

      if (values.type === 'text' && !values.question) errors.question = 'Required';
      if (values.type === 'image' && !values.questionImg) errors.questionImg = 'Required';
      if (values.type === 'video' && !values.questionVideo) {
        errors.questionVideo = 'Required';
      }
      if (!values.answer) errors.answer = 'Required';

      return errors;
    },
    onSubmit: ({ type, question, answer, questionImg, questionVideo }) => {
      if (type === 'text') {
        onSave({ type, question, answer });
      } else {
        onSave({
          type,
          question: MEDIA_QUESTION_TEXT[type],
          answer,
          questionImg,
          ...(type === 'video' && { questionVideo }),
        });
      }
    },
  });

  const currentFormat =
    Object.keys(QUESTION_FORMATS).find(
      (label) => QUESTION_FORMATS[label] === cardForm.values.type,
    ) ?? 'Text';

  const handleFormatChange = (label: string) => {
    setMediaError('');
    cardForm.setFieldValue('type', QUESTION_FORMATS[label]);
  };

  const handleImageSelect = async (file: File) => {
    setMediaError('');

    try {
      await cardForm.setFieldValue(
        'questionImg',
        await resizeImage(file, CARD_IMAGE_SIZE),
      );
    } catch (e) {
      setMediaError(e instanceof Error ? e.message : 'The image could not be uploaded');
    }
  };

  const handleVideoSelect = async (file: File) => {
    setMediaError('');

    try {
      const poster = await captureVideoPoster(file, VIDEO_POSTER_SIZE);
      const uploadSize = file.size + getDataUrlSize(poster);

      if (uploadSize > MAX_UPLOAD_SIZE) {
        throw new Error(
          `The video is too large: ${formatFileSize(uploadSize)} of ${formatFileSize(MAX_UPLOAD_SIZE)} allowed`,
        );
      }

      await cardForm.setFieldValue('questionImg', poster, false);
      await cardForm.setFieldValue('questionVideo', await readFileAsDataUrl(file));
    } catch (e) {
      setMediaError(e instanceof Error ? e.message : 'The video could not be uploaded');
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
      ) : cardForm.values.type === 'image' ? (
        <MediaField
          label={'Question:'}
          changeLabel={'Change image'}
          placeholder={'No image'}
          accept={'image/*'}
          value={cardForm.values.questionImg}
          error={mediaError || getFieldError('questionImg')}
          onSelect={handleImageSelect}
        />
      ) : (
        <MediaField
          label={'Question:'}
          changeLabel={'Change video'}
          placeholder={'No video'}
          accept={'video/*'}
          mediaType={'video'}
          value={cardForm.values.questionVideo}
          poster={cardForm.values.questionImg}
          error={mediaError || getFieldError('questionVideo')}
          onSelect={handleVideoSelect}
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
