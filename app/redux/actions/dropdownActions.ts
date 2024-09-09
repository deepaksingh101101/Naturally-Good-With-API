// src/app/redux/actions/employeeActions.ts
import apiCall from '@/lib/axios';
import { RoleName } from '@/types/RoleName';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setLoading } from '../slices/authSlice';
import { AxiosResponse } from 'axios';



// Action to create a new employee
// Action to fetch all roles
export const getAllRoleName = createAsyncThunk<
  AxiosResponse<RoleName[]>, // Return type is the entire Axios response
  void, // No input parameters
  { rejectValue: any } // Reject value type
>(
  'role/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall<RoleName[]>('GET', '/admin/role');
      console.log('API Response:', response); // Log the full response for debugging

      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      console.error('Error fetching role names:', error); // Log the error for debugging
      return rejectWithValue(error); // Return the error directly
    }
  }
);

export const createRole = createAsyncThunk<
  AxiosResponse<RoleName>, // Return type is the entire Axios response
  Omit<RoleName, '_id'>, // Input type excluding '_id'
  { rejectValue: any } // Reject value type
>(
  'role/create',
  async (roleData, { rejectWithValue }) => {
    try {
      // Make API call to create a role
      const response = await apiCall<RoleName>('POST', '/admin/role', roleData);
      console.log('API Response:', response); // Log the full response for debugging

      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      // Handle errors and return the error message
      return rejectWithValue(error || 'Failed to create role');
    }
  }
);
// Action to update an existing role
export const updateRole = createAsyncThunk<
  AxiosResponse<RoleName>, // Return type is the entire Axios response
  RoleName, // Input type includes the full RoleName
  { rejectValue: any } // Reject value type
>(
  'role/update',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await apiCall<RoleName>('PUT', `/admin/role/${roleData._id}`, roleData);
      return response; // Return the full response
    } catch (error: any) {
      console.error('Error updating role:', error);
      return rejectWithValue(error); // Return the error directly
    }
  }
);

// Action to delete a role
export const deleteRole = createAsyncThunk<
  AxiosResponse<string>, // Return type can be the ID of the deleted role
  string, // Input type is the role ID
  { rejectValue: any } // Reject value type
>(
  'role/delete',
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await apiCall('DELETE', `/admin/role/${roleId}`);
      return response; // Return the full response
    } catch (error: any) {
      console.error('Error deleting role:', error);
      return rejectWithValue(error); // Return the error directly
    }
  }
);