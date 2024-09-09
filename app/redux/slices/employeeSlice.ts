import { Employee } from '@/types/Employee';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEmployee, getEmployeeById } from '../actions/employeeActions';
import { AxiosResponse } from 'axios'; // Import AxiosResponse

interface EmployeeState {
  loading: boolean;
  employees: Employee[];
  selectedEmployee: Employee | null; // To store the fetched employee
  error: string | null;
}

const initialState: EmployeeState = {
  loading: false,
  employees: [],
  selectedEmployee: null, // Initialize selectedEmployee as null
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
        const newEmployee = action.payload.data; // Assuming the actual employee data is in action.payload.data
        state.employees.push(newEmployee);
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true; // Set loading to true when fetching employee
      })
      .addCase(getEmployeeById.fulfilled, (state, action: PayloadAction<AxiosResponse<Employee>>) => {
        state.loading = false; // Set loading to false when fetching is successful
        state.selectedEmployee = action.payload.data; // Store fetched employee data
      })
      .addCase(getEmployeeById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Capture the error message
      });
  },
});

export default employeeSlice.reducer;