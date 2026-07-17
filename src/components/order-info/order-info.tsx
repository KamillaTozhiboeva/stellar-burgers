import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TOrder, TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feeds.orders || []);

  const profileOrders = useSelector(
    (state) => (state.orders as any).orders || state.orders || []
  );
  const allIngredients = useSelector(
    (state) => state.ingredients.ingredients || []
  );

  const orderData = useMemo(
    () =>
      feedOrders?.find((o: TOrder) => o.number === Number(number)) ||
      profileOrders?.find((o: TOrder) => o.number === Number(number)) ||
      null,
    [feedOrders, profileOrders, number]
  );

  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.success) {
            
          }
        })
        .catch(console.error);
    }
  }, [orderData, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
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
      {} as TIngredientsWithCount
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & { count: number })[]
    ).reduce((acc: number, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, allIngredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
