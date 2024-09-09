// src/app/redux/actions/employeeActions.ts
import apiCall from '@/lib/axios';
import { RoleName } from '@/types/RoleName';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setLoading } from '../slices/authSlice';



// Action to create a new employee
export const getAllRoleName = createAsyncThunk<RoleName[], void, { rejectValue: any }>(
  'role/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall<RoleName[]>('GET', '/admin/role');
      console.log('API Response:', response); // Log the full response for debugging

      // Assuming response.data contains the array of RoleName
      return response.data; // Extract and return the data array
    } catch (error: any) {
      console.error('Error fetching role names:', error); // Log the error for debugging
      return rejectWithValue(error.response?.data || 'Failed to fetch role names');
    }
  }
);

