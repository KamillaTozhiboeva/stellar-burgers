import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()) // Вызываем thunk выхода
      .unwrap()
      .then(() => navigate('/login', { replace: true })) // Отправляем на логин
      .catch((err) => console.error('Ошибка:', err));
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
