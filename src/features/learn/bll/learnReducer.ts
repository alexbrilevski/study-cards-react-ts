import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../main/bll/createAppAsyncThunk';
import type { Card } from '../../../main/types/card';
import type { Grade } from '../../../main/types/grade';
import { cardListAPI } from '../../cardList/dal/cardListApi';
import { handleApiRequestError } from '../../../utils/notificationUtils';
import { getRandomCard } from '../../../utils/getRandomCard';
import { learnAPI, type UpdateCardGradeData } from '../dal/learnApi';

type LearnState = {
  cardPack: {
    packName: string;
    cards: Card[];
  };
  currentCardId: string | null;
  isFetchingCardPack: boolean;
};

const initialState: LearnState = {
  cardPack: {
    packName: '',
    cards: [],
  },
  currentCardId: null,
  isFetchingCardPack: true,
};

export const fetchCardPackToLearn = createAppAsyncThunk(
  'learn/fetchCardPackToLearn',
  async (cardPackId: string, { dispatch, signal }) => {
    try {
      const { packName, cards } = await cardListAPI.getCards(
        { cardsPack_id: cardPackId, pageCount: 1000000 },
        signal,
      );
      return { packName, cards, currentCardId: getRandomCard(cards)?._id ?? null };
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const updateCardGrade = createAppAsyncThunk(
  'learn/updateCardGrade',
  async (data: UpdateCardGradeData, { dispatch, getState }) => {
    try {
      const { updatedGrade } = await learnAPI.updateCardGrade(data);
      if (updatedGrade) dispatch(setUpdatedCardGrade(updatedGrade));

      const { cards } = getState().learn.cardPack;
      dispatch(setCurrentCardId(getRandomCard(cards)?._id ?? null));
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

const learnSlice = createSlice({
  name: 'learn',
  initialState,
  reducers: {
    setUpdatedCardGrade(state, action: PayloadAction<Grade>) {
      const { card_id, grade, shots } = action.payload;
      const card = state.cardPack.cards.find((card) => card._id === card_id);

      if (card) {
        card.grade = grade;
        card.shots = shots;
      }
    },
    setCurrentCardId(state, action: PayloadAction<string | null>) {
      state.currentCardId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardPackToLearn.pending, () => initialState)
      .addCase(fetchCardPackToLearn.fulfilled, (state, action) => {
        const { packName, cards, currentCardId } = action.payload;

        state.cardPack = { packName, cards };
        state.currentCardId = currentCardId;
        state.isFetchingCardPack = false;
      })
      .addCase(fetchCardPackToLearn.rejected, (state, action) => {
        if (!action.meta.aborted) state.isFetchingCardPack = false;
      });
  },
});

const { setUpdatedCardGrade, setCurrentCardId } = learnSlice.actions;
export const learnReducer = learnSlice.reducer;
