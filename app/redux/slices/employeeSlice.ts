// src/app/redux/slices/employeeSlice.ts
import { Employee } from '@/types/Employee';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEmployee, getEmployeeById, updateEmployee } from '../actions/employeeActions';
import { AxiosResponse } from 'axios';

interface EmployeeState {
  loading: boolean;
  employees: Employee[];
  selectedEmployee: Employee | null;
  error: string | null;
}

const initialState: EmployeeState = {
  loading: false,
  employees: [],
  selectedEmployee: null,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<AxiosResponse<Employee>>) => {
        state.loading = false;
        const newEmployee = action.payload.data;
        state.employees.push(newEmployee);
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeeById.fulfilled, (state, action: PayloadAction<AxiosResponse<Employee>>) => {
        state.loading = false;
        state.selectedEmployee = action.payload.data;
      })
      .addCase(getEmployeeById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true; // Set loading to true when updating employee
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<AxiosResponse<Employee>>) => {
        state.loading = false; // Set loading to false when update is successful
        const updatedEmployee = action.payload.data; // Assuming the updated employee data is in action.payload.data
        // Update the employees array with the updated employee data
        state.employees = state.employees.map(employee =>
          employee._id === updatedEmployee._id ? updatedEmployee : employee
        );
        state.selectedEmployee = updatedEmployee; // Optionally update the selected employee
      })
      .addCase(updateEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Capture the error message
      });
  },
});

export default employeeSlice.reducer;