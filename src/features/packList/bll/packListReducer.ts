import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../../main/bll/createAppAsyncThunk';
import type { Pack, PackListQueryParams } from '../../../main/types/pack';
import { handleApiRequestError } from '../../../utils/notificationUtils';
import {
  packListAPI,
  type AddPackRequestData,
  type UpdatePackRequestData,
} from '../dal/packListApi';

type PackListState = {
  cardPacks: Pack[];
  cardPacksTotalCount: number;
  maxCardsCount: number;
  minCardsCount: number;
  params: {
    user_id?: string;
    packName?: string;
    max?: number;
    min?: number;
    sortPacks: string;
    page: number;
    pageCount: number;
  };
};

const initialState: PackListState = {
  cardPacks: [],
  cardPacksTotalCount: 0,
  maxCardsCount: 0,
  minCardsCount: 0,
  params: {
    user_id: undefined,
    packName: undefined,
    max: undefined,
    min: undefined,
    sortPacks: '0updated',
    page: 1,
    pageCount: 10,
  },
};

export const fetchPackList = createAppAsyncThunk(
  'packList/fetchPackList',
  async (_, { getState, dispatch, signal }) => {
    try {
      return await packListAPI.getPacks(getState().packList.params, signal);
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const addPack = createAppAsyncThunk(
  'packList/addPack',
  async (cardsPack: AddPackRequestData, { dispatch }) => {
    try {
      const data = await packListAPI.addPack(cardsPack);
      if (data.newCardsPack) await dispatch(fetchPackList());
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const editPack = createAppAsyncThunk(
  'packList/editPack',
  async (cardsPack: UpdatePackRequestData, { dispatch }) => {
    try {
      const data = await packListAPI.updatePack(cardsPack);
      if (data.updatedCardsPack) await dispatch(fetchPackList());
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

export const deletePack = createAppAsyncThunk(
  'packList/deletePack',
  async (id: string, { dispatch }) => {
    try {
      const data = await packListAPI.deletePack(id);
      if (data.deletedCardsPack) await dispatch(fetchPackList());
    } catch (error) {
      handleApiRequestError(error, dispatch);
      throw error;
    }
  },
);

const packListSlice = createSlice({
  name: 'packList',
  initialState,
  reducers: {
    setPackListParams(state, action: PayloadAction<PackListQueryParams>) {
      Object.assign(state.params, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPackList.fulfilled, (state, action) => {
      const {
        cardPacks,
        cardPacksTotalCount,
        minCardsCount,
        maxCardsCount,
        page,
        pageCount,
      } = action.payload;

      state.cardPacks = cardPacks;
      state.cardPacksTotalCount = cardPacksTotalCount;
      state.minCardsCount = minCardsCount;
      state.maxCardsCount = maxCardsCount;
      state.params.page = page;
      state.params.pageCount = pageCount;
    });
  },
});

export const { setPackListParams } = packListSlice.actions;
export const packListReducer = packListSlice.reducer;
