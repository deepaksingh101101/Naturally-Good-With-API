import { Employee } from '@/types/Employee';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEmployee } from '../actions/employeeActions';
import { AxiosResponse } from 'axios'; // Import AxiosResponse

interface EmployeeState {
  loading: boolean;
  employees: Employee[];
  error: string | null;
}

const initialState: EmployeeState = {
  loading: false,
  employees: [],
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
        // Extract the employee data from the response
        const newEmployee = action.payload.data; // Assuming the actual employee data is in action.payload.data
        state.employees.push(newEmployee);
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;