import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderHistory,
  getUserOrders
} from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
