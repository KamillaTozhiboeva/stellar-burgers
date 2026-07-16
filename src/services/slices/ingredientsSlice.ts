import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

// 1. Описываем, как будут выглядеть данные в хранилище
interface IIngredientsState {
  ingredients: TIngredient[]; // Список всех ингредиентов
  isLoading: boolean; // Крутится ли сейчас крутилка загрузки
  error: string | null; // Сюда запишем ошибку, если сервер упадет
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// 2. Асинхронный экшен: делает запрос к серверу за ингредиентами
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data; // Возвращает массив ингредиентов с сервера
  }
);

// 3. Создаем сам слайс
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Обычные экшены нам тут не нужны
  extraReducers: (builder) => {
    builder
      // Когда запрос только начался
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Когда ингредиенты успешно прилетели с сервера
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      // Если на сервере произошла ошибка
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
      });
  }
});

// 4. Экспортируем селекторы для использования в компонентах
// (Они позволят компонентам "увидеть" ингредиенты и состояние загрузки)
export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoadingState = (state: RootState) =>
  state.ingredients.isLoading;
export default ingredientsSlice.reducer;
