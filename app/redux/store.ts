// src/app/redux/store.ts
'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice'; // Import employee reducer
import productReducer from './slices/productSlice'; // Import employee reducer
import bagReducer from './slices/bagSlice'; // Import employee reducer
import SubscriptionTypeReducer from './slices/subscriptionTypeSlice'; // Import employee reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer, // Add employee reducer
    products: productReducer, // Add employee reducer
    bags: bagReducer, 
    subscriptionType: SubscriptionTypeReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;