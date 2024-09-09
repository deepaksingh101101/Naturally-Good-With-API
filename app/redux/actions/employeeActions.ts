// src/app/redux/actions/employeeActions.ts
import apiCall from '@/lib/axios';
import { Employee } from '@/types/Employee';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';



// Action to create a new employee
export const createEmployee = createAsyncThunk<
  AxiosResponse<Employee>, // Change this to AxiosResponse<Employee>
  Employee,
  { rejectValue: any }
>(
  'employees/create',
  async (employeeData, { rejectWithValue }) => {
    try {
      // Make API call to create an employee
      const response = await apiCall<Employee>('POST', '/admin/employee', employeeData);
      console.log('API Response:', response); // Log the full response for debugging

      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      // Handle errors and return the error message
      return rejectWithValue(error || 'Failed to create employee');
    }
  }
);

// // Action to update an existing employee
// export const updateEmployee = createAsyncThunk<Employee, Employee, { rejectValue: any }>(
//   'employees/update',
//   async (employeeData, { rejectWithValue }) => {
//     try {
//       // Make API call to update an employee
//       return await apiCall('PUT', `${API_URL}/${employeeData.employeeId}`, employeeData);
//     } catch (error: any) {
//       // Handle errors and return the error message
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );