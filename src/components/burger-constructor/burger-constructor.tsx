import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorState,
  clearConstructor
} from '../../services/slices/constructorSlice';
// Импортируем Thunk и селекторы из нового слайса
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

  // Получаем данные пользователя из стейта (убедись, что селектор написан правильно)
  const { user } = useSelector((store: any) => store.user);

  // Получаем статусы заказа из Redux вместо useState
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

    // Диспатчим Thunk вместо прямого вызова API
    dispatch(orderBurger(orderDataIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((err: unknown) => {
        // Добавили : unknown
        console.error('Ошибка:', err);
      });
  };

  const closeOrderModal = () => {
    // Очищаем данные заказа в Redux при закрытии модалки
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
