import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';
import { RootState } from '../store';

export interface TFeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки ленты');
    }
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getFeedsState: (state) => state,
    getFeedsOrders: (state) => state.orders,
    getFeedsTotal: (state) => state.total,
    getFeedsTotalToday: (state) => state.totalToday
  }
});

export default feedsSlice.reducer;

export const getFeedsState = (state: RootState) => state.feeds;
export const getFeedsOrders = (state: RootState) => state.feeds.orders;
export const getFeedsTotal = (state: RootState) => state.feeds.total;
export const getFeedsTotalToday = (state: RootState) => state.feeds.totalToday;
