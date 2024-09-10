import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { createProductType, deleteProductType } from '../actions/dropdownActions';
import { ProductType } from '@/types/Dropdown'; // Adjust the import according to your project structure

interface ProductTypeState {
    loading: boolean;
    productTypes: ProductType[]; // Array to store product types
    error: string | null;
}

const initialState: ProductTypeState = {
    loading: false,
    productTypes: [],
    error: null,
};

const productTypeSlice = createSlice({
    name: 'productTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createProductType.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
            })
            .addCase(createProductType.fulfilled, (state, action: PayloadAction<AxiosResponse<ProductType>>) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                const newProductType = action.payload.data; // Extract the product type data from the response
                state.productTypes.push(newProductType); // Add the new product type to the productTypes array
            })
            .addCase(createProductType.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false; // Set loading to false on rejection
                state.error = action.payload; // Set the error message from the payload
            })
            .addCase(deleteProductType.pending, (state) => {
                state.loading = true; // Set loading to true when the delete request is pending
            })
            .addCase(deleteProductType.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false; // Set loading to false when the delete request is fulfilled
                // Remove the deleted product type from the state array
                state.productTypes = state.productTypes.filter(productType => productType._id !== action.payload);
            })
            .addCase(deleteProductType.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false; // Set loading to false on rejection
                state.error = action.payload; // Set the error message from the payload
            });
    },
});

// Export the reducer
export default productTypeSlice.reducer;