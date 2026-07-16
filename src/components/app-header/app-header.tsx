import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  // Достаём имя авторизованного пользователя из Redux-стейта,
  // чтобы оно отображалось на кнопке «Личный кабинет»
  const { user } = useSelector((store) => store.user);

  // Передаем имя пользователя (если он авторизован) в UI-компонент шапки.
  // AppHeaderUI внутри себя уже содержит NavLink'и на '/', '/feed' и '/profile'.
  return <AppHeaderUI userName={user?.name} />;
};
