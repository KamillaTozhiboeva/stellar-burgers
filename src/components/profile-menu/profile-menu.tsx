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
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/login', { replace: true }))
      .catch((err) => console.error('Ошибка:', err));
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
