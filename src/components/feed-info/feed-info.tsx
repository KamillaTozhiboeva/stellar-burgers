import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  getFeedsOrders,
  getFeedsTotal,
  getFeedsTotalToday
} from '../../services/slices/feedsSlice';

// Вспомогательная функция для фильтрации по статусу
const getOrdersByStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Достаем данные с использованием правильных названий селекторов
  const orders = useSelector(getFeedsOrders);
  const total = useSelector(getFeedsTotal);
  const totalToday = useSelector(getFeedsTotalToday);
  const readyOrders = getOrdersByStatus(orders, 'done');
  const pendingOrders = getOrdersByStatus(orders, 'pending');
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
