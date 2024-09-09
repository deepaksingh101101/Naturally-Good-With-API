// src/app/redux/store.ts
'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice'; // Import employee reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer, // Add employee reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;