import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../main/bll/createAppAsyncThunk';
import type { Card, CardListQueryParams } from '../../../main/types/card';
import { handleApiRequestError } from '../../../utils/notificationUtils';
import { cardListAPI, type NewCardData, type UpdateCardData } from '../dal/cardListApi';
import { packListAPI, type UpdatePackRequestData } from '../../packList/dal/packListApi';

type CardListState = {
  cards: Card[];
  packUserId: string;
  packName: string;
  packPrivate: boolean;
  packDeleted: boolean;
  cardsTotalCount: number;
  maxGrade: number;
  minGrade: number;
  params: {
    cardAnswer?: string;
    cardQuestion?: string;
    min?: number;
    max?: number;
    sortCards: string;
    page: number;
    pageCount: number;
  };
};

const initialState: CardListState = {
  cards: [],
  packUserId: '',
  packName: '',
  packPrivate: false,
  packDeleted: false,
  cardsTotalCount: 0,
  maxGrade: 0,
  minGrade: 0,
  params: {
    cardAnswer: undefined,
    cardQuestion: undefined,
    min: undefined,
    max: undefined,
    sortCards: '0updated',
    page: 1,
    pageCount: 10,
  },
};

export const fetchCardList = createAppAsyncThunk(
  'cardList/fetchCardList',
  async (cardsPack_id: string, { getState, dispatch, signal }) => {
    try {
      const params = { cardsPack_id, ...getState().cardList.params };
      return await cardListAPI.getCards(params, signal);
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const addCard = createAppAsyncThunk(
  'cardList/addCard',
  async (cardData: NewCardData, { dispatch }) => {
    try {
      const { newCard } = await cardListAPI.addCard(cardData);
      if (newCard) await dispatch(fetchCardList(newCard.cardsPack_id));
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const editCard = createAppAsyncThunk(
  'cardList/editCard',
  async (cardData: UpdateCardData, { dispatch }) => {
    try {
      const { updatedCard } = await cardListAPI.updateCard(cardData);
      if (updatedCard) await dispatch(fetchCardList(updatedCard.cardsPack_id));
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const deleteCard = createAppAsyncThunk(
  'cardList/deleteCard',
  async (id: string, { dispatch }) => {
    try {
      const { deletedCard } = await cardListAPI.deleteCard(id);
      await dispatch(fetchCardList(deletedCard.cardsPack_id));
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const editCurrentCardPack = createAppAsyncThunk(
  'cardList/editCurrentCardPack',
  async (cardsPack: UpdatePackRequestData, { dispatch }) => {
    try {
      const { updatedCardsPack } = await packListAPI.updatePack(cardsPack);
      return updatedCardsPack;
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const deleteCurrentCardPack = createAppAsyncThunk(
  'cardList/deleteCurrentCardPack',
  async (id: string, { dispatch }) => {
    try {
      const { deletedCardsPack } = await packListAPI.deletePack(id);
      return Boolean(deletedCardsPack);
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

const cardListSlice = createSlice({
  name: 'cardList',
  initialState,
  reducers: {
    setCardListParams(
      state,
      action: PayloadAction<Omit<CardListQueryParams, 'cardsPack_id'>>,
    ) {
      Object.assign(state.params, action.payload);
    },
    resetCardListState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardList.fulfilled, (state, action) => {
        const data = action.payload;

        state.cards = data.cards;
        state.packUserId = data.packUserId;
        state.packName = data.packName;
        state.packPrivate = data.packPrivate;
        state.cardsTotalCount = data.cardsTotalCount;
        state.maxGrade = data.maxGrade;
        state.minGrade = data.minGrade;
        state.params.page = data.page;
        state.params.pageCount = data.pageCount;
      })
      .addCase(editCurrentCardPack.fulfilled, (state, action) => {
        if (action.payload) {
          state.packName = action.payload.name;
          state.packPrivate = action.payload.private;
        }
      })
      .addCase(deleteCurrentCardPack.fulfilled, (state, action) => {
        if (action.payload) state.packDeleted = true;
      });
  },
});

export const { setCardListParams, resetCardListState } = cardListSlice.actions;
export const cardListReducer = cardListSlice.reducer;
