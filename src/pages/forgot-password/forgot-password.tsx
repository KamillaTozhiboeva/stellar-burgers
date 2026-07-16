import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

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

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
