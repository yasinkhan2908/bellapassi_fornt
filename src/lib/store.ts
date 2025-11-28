// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../lib/slices/cartSlice';
export function loadState() {
  if (typeof window === "undefined") return undefined; // SSR-safe

  try {
    const saved = sessionStorage.getItem("reduxState");
    if (!saved) return undefined;
    return JSON.parse(saved);
  } catch {
    return undefined;
  }
}
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store
export type AppDispatch = typeof store.dispatch;

