import { useEffect, type FC } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Card } from '../../../main/types/card';
import type { User } from '../../../main/types/user';
import { useAppDispatch, useAppSelector } from '../../../main/bll/store';
import { fetchCardPackToLearn } from '../bll/learnReducer';
import { PATH } from '../../../main/ui/Main/Pages';
import ButtonBack from '../../../main/ui/common/components/ButtonBack/ButtonBack';
import { LearnCard } from './LearnCard/LearnCard';
import s from './LearnPage.module.css';

export const LearnPage: FC = () => {
  const { cardPackId } = useParams<'cardPackId'>();
  const authUser = useAppSelector<User | null>((state) => state.profile.user);
  const packName = useAppSelector<string>((state) => state.learn.cardPack.packName);
  const currentCard = useAppSelector<Card | null>(
    (state) =>
      state.learn.cardPack.cards.find((card) => card._id === state.learn.currentCardId) ??
      null,
  );
  const isFetchingCardPack = useAppSelector<boolean>(
    (state) => state.learn.isFetchingCardPack,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cardPackId) return;

    const controller = new AbortController();
    dispatch(fetchCardPackToLearn(cardPackId, controller.signal));

    return () => controller.abort();
  }, [cardPackId, dispatch]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!authUser) {
    return <Navigate to={PATH.LOGIN} />;
  }

  return (
    <>
      <ButtonBack caption={'Back'} onClick={handleGoBack} />
      <div className={s['learn-page-container']}>
        <h1>Learn "{packName}"</h1>
        {isFetchingCardPack ? (
          <p className={s['card-preloader']}>
            Just a moment, please.
            <br />
            Fetching a random card...
          </p>
        ) : (
          <LearnCard key={currentCard?._id} card={currentCard} />
        )}
      </div>
    </>
  );
};
