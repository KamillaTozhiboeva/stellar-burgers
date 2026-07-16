import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
// Импортируем селекторы из наших готовых слайсов
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { getFeedsOrders } from '../../services/slices/feedsSlice';
import { getUserOrders } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  // 1. Достаем номер заказа из URL (роутер подставит его автоматически)
  const { number } = useParams();

  // 2. Получаем списки ингредиентов и все загруженные заказы из Redux
  const ingredients = useSelector(getIngredients);
  const feedOrders = useSelector(getFeedsOrders);
  const userOrders = useSelector(getUserOrders);

  // 3. Ищем заказ с нужным номером в обоих массивах
  const orderData = useMemo(() => {
    // Объединяем общую ленту и личные заказы профиля
    const allOrders = [...feedOrders, ...userOrders];
    // Ищем совпадение по номеру (приводим к Number, так как из useParams приходит строка)
    return allOrders.find((order) => order.number === Number(number)) || null;
  }, [feedOrders, userOrders, number]);

  // 4. Стандартная логика сборки заказа для UI (из шаблона Практикума)
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если заказ пока не найден, крутим лоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
