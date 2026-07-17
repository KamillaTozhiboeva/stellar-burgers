import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, getFeedsOrders } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedsOrders);
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
