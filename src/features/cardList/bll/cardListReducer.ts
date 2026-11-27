import { setAppIsLoading } from '../../../main/bll/appReducer';
import type { RootThunk } from '../../../main/bll/store';
import type { Card, CardListData, CardListQueryParams } from '../../../main/types/card';
import type { Pack } from '../../../main/types/pack';
import { handleApiRequestError } from '../../../utils/notificationUtils';
import { cardListAPI, type NewCardData, type UpdateCardData } from '../dal/cardListApi';
import { packListAPI, type UpdatePackRequestData } from '../../packList/dal/packListApi';

// Constants
const ACTION_TYPES = {
  SET_CARD_LIST_DATA: 'card-list/SET-DATA',
  SET_CARD_LIST_PARAMS: 'card-list/SET-CARD-LIST-PARAMS',
  UPDATE_CURRENT_CARD_PACK: 'card-list/UPDATE-CURRENT-CARD-PACK',
  SET_DELETED_CARD_PACK_STATE: 'card-list/SET-DELETED-CARD-PACK-STATE',
  RESET_CARD_LIST_STATE: 'card-list/RESET-CARD-LIST-STATE',
} as const;

export type CardListActions =
  | ReturnType<typeof setCardListData>
  | ReturnType<typeof setCardListParams>
  | ReturnType<typeof updateCurrentCardPack>
  | ReturnType<typeof setDeletedCardPackState>
  | ReturnType<typeof resetCardListState>;

type InitState = typeof initState;

const initState = {
  cards: [] as Card[],
  packUserId: '',
  packName: '',
  packPrivate: false,
  packDeckCover: '',
  packDeleted: false,
  cardsTotalCount: 0,
  maxGrade: 0,
  minGrade: 0,
  params: {
    cardAnswer: undefined as string | undefined,
    cardQuestion: undefined as string | undefined,
    min: undefined as number | undefined,
    max: undefined as number | undefined,
    sortCards: '0updated',
    page: 1,
    pageCount: 10,
  },
};

export const cardListReducer = (
  state: InitState = initState,
  action: CardListActions,
): InitState => {
  switch (action.type) {
    case ACTION_TYPES.SET_CARD_LIST_DATA: {
      const { page, pageCount, ...cardListData } = action.payload;
      return {
        ...state,
        ...cardListData,
        packDeckCover: cardListData.packDeckCover ?? '',
        params: { ...state.params, page, pageCount },
      };
    }
    case ACTION_TYPES.SET_CARD_LIST_PARAMS: {
      return { ...state, params: { ...state.params, ...action.payload } };
    }
    case ACTION_TYPES.UPDATE_CURRENT_CARD_PACK:
    case ACTION_TYPES.SET_DELETED_CARD_PACK_STATE: {
      return { ...state, ...action.payload };
    }
    case ACTION_TYPES.RESET_CARD_LIST_STATE: {
      return initState;
    }
    default: {
      return state;
    }
  }
};

// Action creators
const setCardListData = (cardListData: CardListData) =>
  ({ type: ACTION_TYPES.SET_CARD_LIST_DATA, payload: cardListData }) as const;
export const setCardListParams = (params: Omit<CardListQueryParams, 'cardsPack_id'>) =>
  ({ type: ACTION_TYPES.SET_CARD_LIST_PARAMS, payload: params }) as const;
const updateCurrentCardPack = (pack: Pack) =>
  ({
    type: ACTION_TYPES.UPDATE_CURRENT_CARD_PACK,
    payload: {
      packName: pack.name,
      packPrivate: pack.private,
      packDeckCover: pack.deckCover ?? '',
    },
  }) as const;
export const setDeletedCardPackState = (isDeleted: boolean) =>
  ({
    type: ACTION_TYPES.SET_DELETED_CARD_PACK_STATE,
    payload: { packDeleted: isDeleted },
  }) as const;
export const resetCardListState = () =>
  ({ type: ACTION_TYPES.RESET_CARD_LIST_STATE }) as const;

// Thunk creators
export const fetchCardList =
  (cardsPack_id: string, signal?: AbortSignal): RootThunk =>
  (dispatch, getState) => {
    const params = { cardsPack_id, ...getState().cardList.params };

    dispatch(setAppIsLoading(true));
    cardListAPI
      .getCards(params, signal)
      .then((data) => {
        dispatch(setCardListData(data));
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
export const addCard =
  (cardData: NewCardData): RootThunk =>
  (dispatch) => {
    dispatch(setAppIsLoading(true));
    cardListAPI
      .addCard(cardData)
      .then((data) => {
        const { newCard } = data;
        if (newCard) {
          dispatch(fetchCardList(newCard.cardsPack_id));
        }
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
export const editCard =
  (cardData: UpdateCardData): RootThunk =>
  (dispatch) => {
    dispatch(setAppIsLoading(true));
    cardListAPI
      .updateCard(cardData)
      .then((data) => {
        const { updatedCard } = data;
        if (updatedCard) {
          dispatch(fetchCardList(updatedCard.cardsPack_id));
        }
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
export const deleteCard =
  (id: string): RootThunk =>
  (dispatch) => {
    dispatch(setAppIsLoading(true));
    cardListAPI
      .deleteCard(id)
      .then((data) => {
        const { deletedCard } = data;
        dispatch(fetchCardList(deletedCard.cardsPack_id));
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
export const editCurrentCardPack =
  (cardsPack: UpdatePackRequestData): RootThunk =>
  (dispatch) => {
    dispatch(setAppIsLoading(true));
    packListAPI
      .updatePack(cardsPack)
      .then((data) => {
        const { updatedCardsPack } = data;
        if (updatedCardsPack) {
          dispatch(updateCurrentCardPack(updatedCardsPack));
        }
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
export const deleteCurrentCardPack =
  (id: string): RootThunk =>
  (dispatch) => {
    dispatch(setAppIsLoading(true));
    packListAPI
      .deletePack(id)
      .then((data) => {
        const { deletedCardsPack } = data;
        if (deletedCardsPack) {
          dispatch(setDeletedCardPackState(true));
        }
      })
      .catch((error) => {
        handleApiRequestError(error, dispatch);
      })
      .finally(() => {
        dispatch(setAppIsLoading(false));
      });
  };
