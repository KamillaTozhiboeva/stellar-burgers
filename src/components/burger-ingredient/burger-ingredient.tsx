import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { bun, ingredients: constructorIngredients } = useSelector(
      (state) => state.constructorBurger
    );

    const currentCount = (() => {
      if (ingredient.type === 'bun') {
        return bun?._id === ingredient._id ? 2 : 0;
      }
      return constructorIngredients.filter(
        (cItem) => cItem._id === ingredient._id
      ).length;
    })();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={currentCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
