import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface TOrdersState {
  history: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TOrdersState = {
  history: [],
  isLoading: false,
  error: null
};

export const getOrderHistory = createAsyncThunk(
  'orders/getHistory',
  async () => await getOrdersApi()
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории';
      });
  }
});

export default ordersSlice.reducer;

export const getUserOrders = (state: RootState) => state.orders.history;
