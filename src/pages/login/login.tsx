import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Достаем ошибку из стора, чтобы показать её пользователю, если пароль неверный
  const { error } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Выясняем, откуда пришёл пользователь (чтобы вернуть его туда после входа)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Диспатчим логин и обрабатываем результат
    dispatch(loginUser({ email, password }))
      .unwrap() // Позволяет обработать результат Thunk как обычный Promise
      .then(() => {
        // При успешном входе перенаправляем пользователя на предыдущую страницу или на главную
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка входа:', err);
      });
  };

  return (
    <LoginUI
      errorText={error || ''} // Теперь ошибки логина будут красиво выводиться на экран
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
