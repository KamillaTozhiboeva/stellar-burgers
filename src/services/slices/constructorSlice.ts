import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

// Описываем тип состояния для нашего конструктора
export interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Начальное состояние пустого конструктора
const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      // Подготовительная функция (prepare) автоматически генерирует уникальный id для каждого не-булочного ингредиента
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    // Удаление ингредиента из конструктора по его уникальному id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Очистка конструктора (понадобится после успешного создания заказа)
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    // Изменение порядка ингредиентов в конструкторе (для Drag-and-Drop / стрелочек перемещения)
    reorderIngredients: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const reorderedItem = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, reorderedItem);
    }
  }
});

// Экспортируем экшены
export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  reorderIngredients
} = constructorSlice.actions;

// Экспортируем селектор с явной типизацией RootState
export const getConstructorState = (state: RootState) =>
  state.constructorBurger;

export default constructorSlice.reducer;
