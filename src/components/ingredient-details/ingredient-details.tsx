import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui';

export const IngredientDetails: FC = () => {
  // 1. Получаем id ингредиента из URL
  const { id } = useParams<{ id: string }>();

  // 2. Получаем список ингредиентов из вашего Redux-хранилища (ingredientsSlice)
  // Убедитесь, что стейт вашего слайса называется 'ingredients'
  const { ingredients } = useSelector((state) => state.ingredients);

  // 3. Ищем нужный ингредиент
  const ingredientData = ingredients.find((item) => item._id === id);

  // Если данные еще не загрузились, показываем лоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Если нашли, передаем в UI
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
