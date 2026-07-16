import { TIngredient, TOrder, TUser } from './types'; // Убрали TRegisterData отсюда

// Реэкспортируем TOrder, чтобы ordersSlice мог его получить из этого файла
export type { TOrder };

export type TRegisterData = {
  email: string;
  password: string;
  name: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

const URL =
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = { success: boolean } & T;

// Вспомогательная функция для получения токена из localStorage
const getAccessToken = () => localStorage.getItem('accessToken') || '';

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      localStorage.setItem('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      (options.headers as { [key: string]: string }).authorization =
        refreshData.accessToken;
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    }
    return Promise.reject(err);
  }
};

// --- API ЗАПРОСЫ ---

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) =>
      checkResponse<{ success: boolean; data: TIngredient[] }>(res)
    )
    .then((data) => data.data);

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`).then((res) => checkResponse<any>(res));

export const getOrdersApi = () =>
  fetchWithRefresh<any>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken()
    }
  }).then((data) => data.orders);

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<any>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken()
    },
    body: JSON.stringify({ ingredients: data })
  });

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<any>(res));

export const loginUserApi = (data: any) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<any>(res));

export const getUserApi = () =>
  fetchWithRefresh<any>(`${URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken()
    }
  });

export const updateUserApi = (data: Partial<TRegisterData>) =>
  fetchWithRefresh<any>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken()
    },
    body: JSON.stringify(data)
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  }).then(checkResponse);

// --- ДОБАВЛЕННЫЕ МЕТОДЫ ДЛЯ СБРОСА ПАРОЛЯ ---

export const forgotPasswordApi = (email: string) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then((res) => checkResponse<any>(res));

export const resetPasswordApi = (password: string, token: string) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token })
  }).then((res) => checkResponse<any>(res));
