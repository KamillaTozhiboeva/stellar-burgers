import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { getOrderByNumberApi } from '../../utils/burger-api';

interface TOrdersState {
  history: TOrder[];
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
}

const initialState: TOrdersState = {
  history: [],
  isLoading: false,
  error: null,
  currentOrder: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);
      if (res.success) return res.orders[0];
      return rejectWithValue('Заказ не найден');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  }
});

export default ordersSlice.reducer;

export const getUserOrders = (state: RootState) => state.orders.history;
