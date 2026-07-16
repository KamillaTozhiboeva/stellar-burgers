import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
// Импортируем thunk и селектор из твоего слайса
import { fetchFeeds, getFeedsOrders } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  // Получаем заказы из стора
  const orders = useSelector(getFeedsOrders);

  // Запрашиваем ленту при загрузке страницы
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Пока заказы не загрузились, показываем прелоадер (крутилку)
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders} // Вот здесь мы передаем массив заказов в левую колонку!
      handleGetFeeds={() => {
        dispatch(fetchFeeds()); // Это сработает при нажатии на кнопку "Обновить"
      }}
    />
  );
};
