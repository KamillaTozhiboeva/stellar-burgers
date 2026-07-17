import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

export interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },

      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

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

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  reorderIngredients
} = constructorSlice.actions;


export const getConstructorState = (state: RootState) =>
  state.constructorBurger;

export default constructorSlice.reducer;
