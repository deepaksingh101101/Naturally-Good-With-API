// src/app/redux/store.ts
'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice'; // Import employee reducer
import productReducer from './slices/productSlice'; // Import employee reducer
import subscriptionReducer from './slices/subscriptionSlice'; // Import employee reducer
import bagReducer from './slices/bagSlice'; // Import employee reducer
import SubscriptionTypeReducer from './slices/subscriptionTypeSlice'; // Import employee reducer
import FrequencyTypeReducer from './slices/frequencyTypeSlice'; // Import employee reducer
import cityReducer from './slices/citySlice'; // Import employee reducer
import vehicleReducer from './slices/vehicleSlice'; // Import employee reducer
import zoneReducer from './slices/zoneSlice'; // Import employee reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer, // Add employee reducer
    products: productReducer, // Add employee reducer
    citys: cityReducer, // Add employee reducer
    vehicles: vehicleReducer, // Add employee reducer
    zones: zoneReducer, // Add employee reducer
    subscriptions: subscriptionReducer, // Add employee reducer
    bags: bagReducer, 
    subscriptionType: SubscriptionTypeReducer, 
    frequencyType: FrequencyTypeReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;