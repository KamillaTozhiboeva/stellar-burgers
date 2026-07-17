import { FC } from 'react';

interface IOrderFeedProps {
  total: number;
  totalToday: number;
}

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
