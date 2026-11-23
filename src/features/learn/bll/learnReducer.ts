import type { Card, CardListData } from '../../../main/types/card';
import type { RootThunk } from '../../../main/bll/store';
import { setAppIsLoading } from '../../../main/bll/appReducer';
import { cardListAPI } from '../../cardList/dal/cardListApi';
import { handleApiRequestError } from '../../../utils/notificationUtils';
import { learnAPI, type UpdateCardGradeData } from '../dal/learnApi';
import type { Grade } from '../../../main/types/grade';
import { getRandomCard } from '../../../utils/getRandomCard';

// Constants
const ACTION_TYPES = {
  SET_CARD_PACK_TO_LEARN: 'learn/SET-CARD-PACK-TO-LEARN',
  SET_UPDATED_CARD_GRADE: 'learn/SET-UPDATED-CARD-GRADE',
  SET_CURRENT_CARD_ID: 'learn/SET-CURRENT-CARD-ID',
  SET_IS_FETCHING_CARD_PACK: 'learn/SET-IS-FETCHING-CARD-PACK',
  RESET_LEARN_STATE: 'learn/RESET-LEARN-STATE',
} as const;

export type LearnActions =
  | ReturnType<typeof setCardPackToLearn>
  | ReturnType<typeof setUpdatedCardGrade>
  | ReturnType<typeof setCurrentCardId>
  | ReturnType<typeof setIsFetchingCardPack>
  | ReturnType<typeof resetLearnState>;

type InitState = typeof initState;

const initState = {
  cardPack: {
    packName: '',
    cards: [] as Card[],
  },
  currentCardId: null as string | null,
  isFetchingCardPack: true,
};

export const learnReducer = (
  state: InitState = initState,
  action: LearnActions,
): InitState => {
  switch (action.type) {
    case ACTION_TYPES.SET_CARD_PACK_TO_LEARN:
    case ACTION_TYPES.SET_CURRENT_CARD_ID:
    case ACTION_TYPES.SET_IS_FETCHING_CARD_PACK: {
      return { ...state, ...action.payload };
    }
    case ACTION_TYPES.RESET_LEARN_STATE: {
      return initState;
    }
    case ACTION_TYPES.SET_UPDATED_CARD_GRADE: {
      const { card_id, grade, shots } = action.payload.grade;
      return {
        ...state,
        cardPack: {
          ...state.cardPack,
          cards: state.cardPack.cards.map((card) =>
            card._id === card_id ? { ...card, grade, shots } : card,
          ),
        },
      };
    }
    default: {
      return state;
    }
  }
};

// Action creators
const setCardPackToLearn = (cardPack: Pick<CardListData, 'packName' | 'cards'>) =>
  ({ type: ACTION_TYPES.SET_CARD_PACK_TO_LEARN, payload: { cardPack } }) as const;
const setUpdatedCardGrade = (grade: Grade) =>
  ({ type: ACTION_TYPES.SET_UPDATED_CARD_GRADE, payload: { grade } }) as const;
const setCurrentCardId = (currentCardId: string | null) =>
  ({ type: ACTION_TYPES.SET_CURRENT_CARD_ID, payload: { currentCardId } }) as const;
const setIsFetchingCardPack = (isFetchingCardPack: boolean) =>
  ({
    type: ACTION_TYPES.SET_IS_FETCHING_CARD_PACK,
    payload: { isFetchingCardPack },
  }) as const;
const resetLearnState = () => ({ type: ACTION_TYPES.RESET_LEARN_STATE }) as const;

// Thunk creators
export const fetchCardPackToLearn =
  (cardPackId: string, signal?: AbortSignal): RootThunk =>
  (dispatch) => {
    dispatch(resetLearnState());
    cardListAPI
      .getCards({ cardsPack_id: cardPackId, pageCount: 1000000 }, signal)
      .then((data) => {
        dispatch(setCardPackToLearn({ packName: data.packName, cards: data.cards }));
        dispatch(setCurrentCardId(getRandomCard(data.cards)?._id ?? null));
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        if (!signal?.aborted) dispatch(setIsFetchingCardPack(false));
      });
  };
export const updateCardGrade =
  (data: UpdateCardGradeData): RootThunk<Promise<void>> =>
  (dispatch, getState) => {
    dispatch(setAppIsLoading(true));
    return learnAPI
      .updateCardGrade(data)
      .then((data) => {
        const { updatedGrade } = data;
        if (updatedGrade) {
          dispatch(setUpdatedCardGrade(updatedGrade));
        }

        const { cards } = getState().learn.cardPack;
        dispatch(setCurrentCardId(getRandomCard(cards)?._id ?? null));
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
