import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    booking: bookingReducer,
  },
});