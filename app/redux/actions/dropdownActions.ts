// src/app/redux/actions/employeeActions.ts
import apiCall from '@/lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setLoading } from '../slices/authSlice';
import { AxiosResponse } from 'axios';
import { ProductType, RoleName, RosterType, SeasonType } from '@/types/Dropdown';



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

// Action to create a new role
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
      console.log(error)
      return rejectWithValue(error);
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


// Product Types

// Action to create a new role
export const createProductType = createAsyncThunk<
  AxiosResponse<ProductType>, // Return type is the entire Axios response
  Omit<ProductType, '_id'>, // Input type excluding '_id'
  { rejectValue: any } // Reject value type
>(
  'productType/create',
  async (productTypeData, { rejectWithValue }) => {
    try {
      console.log(productTypeData)
      // Make API call to create a role
      const response = await apiCall('POST', '/dropDown/productType', productTypeData);

      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      // Handle errors and return the error message
      return rejectWithValue(error);
    }
  }
);

export const getAllProductType = createAsyncThunk<
  AxiosResponse<ProductType[]>, // Return type is the entire Axios response
  void, // No input parameters
  { rejectValue: any } // Reject value type
>(
  'productType/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('GET', '/dropDown/productTypes');
      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      return rejectWithValue(error); // Return the error directly
    }
  }
);


export const deleteProductType = createAsyncThunk<
  string, // Return type is the ID of the deleted product type
  string, // Input type is the product type ID
  { rejectValue: any } // Reject value type
>(
  'productType/delete',
  async (productTypeId, { rejectWithValue }) => {
    try {
      const response:any= await apiCall('DELETE', `/dropDown/productType/${productTypeId}`);
      return productTypeId; // Return the product type ID after successful deletion
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete product type'); // Return the error message
    }
  }
);


// Roster started
// Action to fetch all roster types
export const getAllRosterType = createAsyncThunk<
  AxiosResponse<RosterType[]>, 
  void, 
  { rejectValue: any }
>(
  'rosterType/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('GET', '/dropDown/rosters');
      return response; 
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Action to create a new roster type
export const createRosterType = createAsyncThunk<
  AxiosResponse<RosterType>, 
  Omit<RosterType, '_id'>, 
  { rejectValue: any }
>(
  'rosterType/create',
  async (rosterData, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/dropDown/roster', rosterData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Action to delete a roster type
export const deleteRosterType = createAsyncThunk<
  string, 
  string, 
  { rejectValue: any }
>(
  'rosterType/delete',
  async (rosterId, { rejectWithValue }) => {
    try {
      await apiCall('DELETE', `/dropDown/roster/${rosterId}`);
      return rosterId; // Return the ID of the deleted roster type
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);


// Season started
// Action to fetch all season types
export const getAllSeasonType = createAsyncThunk<
  AxiosResponse<SeasonType[]>, // Return type is the entire Axios response
  void, // No input parameters
  { rejectValue: any } // Reject value type
>(
  'seasonType/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('GET', '/dropDown/seasons');
      return response; // Return the entire response object
    } catch (error: any) {
      return rejectWithValue(error); // Return the error directly
    }
  }
);

// Action to create a new season type
export const createSeasonType = createAsyncThunk<
  AxiosResponse<SeasonType>, // Return type is the created season
  Omit<SeasonType, '_id'>, // Input type is the season data without the ID
  { rejectValue: any } // Reject value type
>(
  'seasonType/create',
  async (seasonData, { rejectWithValue }) => {
    try {
      const response = await apiCall('POST', '/dropDown/season', seasonData);
      return response; // Return the created season response
    } catch (error: any) {
      return rejectWithValue(error); // Return the error
    }
  }
);

// Action to delete a season type
export const deleteSeasonType = createAsyncThunk<
  string, // Return type is the ID of the deleted season type
  string, // Input type is the season type ID
  { rejectValue: any } // Reject value type
>(
  'seasonType/delete',
  async (seasonId, { rejectWithValue }) => {
    try {
      await apiCall('DELETE', `/dropDown/season/${seasonId}`);
      return seasonId; // Return the season type ID after successful deletion
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete season type'); // Return the error message
    }
  }
);



// Subscription type
// Action to create a new role
export const createSubscriptionType = createAsyncThunk<
  AxiosResponse<any>, // Return type is the entire Axios response
  Omit<any, '_id'>, // Input type excluding '_id'
  { rejectValue: any } // Reject value type
>(
  'subscriptionType/create',
  async (subscriptionTypeData, { rejectWithValue }) => {
    try {
      console.log(subscriptionTypeData)
      // Make API call to create a role
      const response = await apiCall('POST', '/dropDown/subscriptiontype', subscriptionTypeData);

      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      // Handle errors and return the error message
      return rejectWithValue(error);
    }
  }
);

export const getAllSubscriptionType = createAsyncThunk<
  AxiosResponse<any[]>, // Return type is the entire Axios response
  void, // No input parameters
  { rejectValue: any } // Reject value type
>(
  'subscriptionType/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('GET', '/dropDown/subscriptiontypes');
      // Return the entire response object
      return response; // Return the full response
    } catch (error: any) {
      return rejectWithValue(error); // Return the error directly
    }
  }
);


export const deleteSubscriptionType = createAsyncThunk<
 string,
  string , // Return type is an object with the response and the deleted ID
  { rejectValue: any } // Reject value type
>(
  'subscriptionType/delete',
  async (subscriptionTypeId, { rejectWithValue }) => {
    try {
      const response:any = await apiCall('DELETE', `/dropDown/subscriptiontype/${subscriptionTypeId}`);
      return subscriptionTypeId; 
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || 'Failed to delete subscription type'); // Return the error message
    }
  }
);
