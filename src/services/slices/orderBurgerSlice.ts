import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store'; // Обязательно импортируем RootState

interface TOrderBurgerState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: TOrderBurgerState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orderBurger/placeOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

export const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
  }
});

export const { clearOrder } = orderBurgerSlice.actions;

// Селекторы с типизацией RootState избавят от ошибки "unknown"
export const getOrderRequest = (state: RootState) =>
  state.orderBurger.orderRequest;
export const getOrderModalData = (state: RootState) =>
  state.orderBurger.orderModalData;

export default orderBurgerSlice.reducer;
