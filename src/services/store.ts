import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedsSlice';
import ordersReducer from './slices/ordersSlice';
// Убедись, что импорт есть
import orderBurgerReducer from './slices/orderBurgerSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ingredients: ingredientsReducer,
    constructorBurger: constructorReducer,
    feeds: feedsReducer,
    orders: ordersReducer,
    // Вот эта строчка критически важна!
    orderBurger: orderBurgerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected = selectorHook;
