import { FC } from 'react';
// Если у тебя используются модульные стили, раскомментируй строку ниже и добавь классы
// import styles from './order-feed.module.css';

// 1. Строго описываем, что компонент принимает два числа
interface IOrderFeedProps {
  total: number;
  totalToday: number;
}

// 2. Обязательно передаем этот интерфейс в FC
export const OrderFeed: FC<IOrderFeedProps> = ({ total, totalToday }) => (
  <section>
    <div>
      <p className='text text_type_main-medium'>Выполнено за все время:</p>
      <p className='text text_type_digits-large'>{total}</p>
    </div>
    <div>
      <p className='text text_type_main-medium'>Выполнено за сегодня:</p>
      <p className='text text_type_digits-large'>{totalToday}</p>
    </div>
  </section>
);
