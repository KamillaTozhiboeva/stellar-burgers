import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorState,
  clearConstructor
} from '../../services/slices/constructorSlice';
import {
  orderBurger,
  clearOrder,
  getOrderRequest,
  getOrderModalData
} from '../../services/slices/orderBurgerSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(getConstructorState);

  const { user } = useSelector((state) => state.user);

  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderDataIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(orderBurger(orderDataIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((err: unknown) => {
        console.error('Ошибка:', err);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{
        bun: bun,
        ingredients: ingredients
      }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
