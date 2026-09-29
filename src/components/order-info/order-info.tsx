import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(
    (state) => state.ingredients.ingredients || []
  );
  const profileOrders = useSelector((state) => state.orders.history || []);
  const feedOrders = useSelector((state) => state.feeds.orders || []);
  const currentOrder = useSelector((state) => state.orders.currentOrder);

  const orderData = useMemo(() => {
    const inFeed = feedOrders.find((o: TOrder) => o.number === Number(number));
    if (inFeed) return inFeed;

    const inProfile = profileOrders.find(
      (o: TOrder) => o.number === Number(number)
    );
    if (inProfile) return inProfile;

    if (currentOrder && currentOrder.number === Number(number)) {
      return currentOrder;
    }

    return null;
  }, [feedOrders, profileOrders, currentOrder, number]);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientWithCount = TIngredient & { count: number };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredientWithCount }, item) => {
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
