import { useNavigate } from 'react-router-dom';
import Button from '../../../common/components/Button/Button';
import error404Img from '../../../../../assets/images/404.svg';
import s from './Error404.module.css';

export const Error404 = () => {
  const navigate = useNavigate();

  const handleBackToHomeClick = () => {
    navigate('/');
  };

  return (
    <div className={s['error-page']}>
      <div className={s['error-text']}>
        <h1 className={s['error-title']}>Ooops!</h1>
        <p className={s['error-message']}>Sorry! Page not found!</p>
        <Button variant={'contained'} color={'primary'} onClick={handleBackToHomeClick}>
          Back to home page
        </Button>
      </div>
      <img
        className={s['error-image']}
        src={error404Img}
        width="451"
        height="192"
        alt="Error 404"
      />
    </div>
  );
};
