import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
// Импортируем твой thunk и наш новый селектор
import {
  getOrderHistory,
  getUserOrders
} from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Достаем заказы из Redux с помощью добавленного селектора
  const orders = useSelector(getUserOrders);

  useEffect(() => {
    // Запускаем thunk, который мы импортировали
    dispatch(getOrderHistory());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
