// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../lib/slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store
export type AppDispatch = typeof store.dispatch;