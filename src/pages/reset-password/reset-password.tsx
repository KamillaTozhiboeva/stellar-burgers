import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Здесь твой вызов API, например:
      // dispatch(forgotPasswordApi(email));
    } catch (err: unknown) {
      // Сужаем тип ошибки, чтобы безопасно с ней работать
      if (err instanceof Error) {
        console.error('Ошибка запроса:', err.message);
        // Здесь можно установить стейт ошибки для показа пользователю
      } else {
        console.error('Произошла неизвестная ошибка', err);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
