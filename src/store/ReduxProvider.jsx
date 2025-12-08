"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeCart } from './slices/cartSlice';

function CartInitializer({ children }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize cart from localStorage on client-side
    dispatch(initializeCart());
  }, [dispatch]);
  
  return <>{children}</>;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <CartInitializer>
        {children}
      </CartInitializer>
    </Provider>
  );
}
