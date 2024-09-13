import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { createProduct, getAllProducts, getProductById, updateProduct, updateProductAvailability } from '../actions/productActions';
import { createSubscription, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionsStatus } from '../actions/subscriptionActions';

interface SubscriptionState {
  loading: boolean;
  subscriptions: any[];
  selectedSubscription: any | null;
  error: string | null;
  currentPage: number; // Track the current page
  totalSubscriptions: number; // Track the total number of products
  totalPages: number; // Track the total number of pages
}

const initialState: SubscriptionState = {
  loading: false,
  subscriptions: [],
  selectedSubscription: null,
  error: null,
  currentPage: 1,
  totalSubscriptions: 0,
  totalPages: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload; // Update currentPage in state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubscription.fulfilled, (state, action: PayloadAction<AxiosResponse<any>>) => {
        state.loading = false;
        const newSubscription = action.payload.data;
        state.subscriptions.push(newSubscription);
        state.totalSubscriptions += 1; // Increment total products count
      })
      .addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubscriptionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscriptionById.fulfilled, (state, action: PayloadAction<AxiosResponse<any>>) => {
        state.loading = false;
        state.selectedSubscription = action.payload.data;
      })
      .addCase(getSubscriptionById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSubscriptions.fulfilled, (state, action: PayloadAction<AxiosResponse<{ total: number; currentPage: number; totalPages: number; products: any[] }>>) => {
        state.loading = false;
        state.subscriptions = action.payload.data.products; // Directly set products from response
        state.totalSubscriptions = action.payload.data.total; // Total products from response
        state.currentPage = action.payload.data.currentPage; // Current page from response
        state.totalPages = action.payload.data.totalPages; // Total pages from response
      })
      .addCase(getAllSubscriptions.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubscription.fulfilled, (state, action: PayloadAction<AxiosResponse<any>>) => {
        state.loading = false;
        const updatedSubscription = action.payload.data;
        state.subscriptions = state.subscriptions.map(subscription =>
          subscription._id === updatedSubscription._id ? updatedSubscription : subscription
        );
        if (state.selectedSubscription && state.selectedSubscription._id === updatedSubscription._id) {
          state.selectedSubscription = updatedSubscription;
        }
      })
      .addCase(updateSubscription.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubscriptionsStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubscriptionsStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedSubscription = action.payload;

        state.subscriptions = state.subscriptions.map(subscription =>
          subscription._id === updatedSubscription?.data?._id ? updatedSubscription?.data : subscription
        );
      })
      .addCase(updateProductAvailability.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = subscriptionSlice.actions; // Export the action

export default subscriptionSlice.reducer; // Export the reducer
