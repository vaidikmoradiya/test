import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this to match your backend URL
const token = localStorage.getItem('token')

export const createaddress = createAsyncThunk(
    'address/create',
    async (value, { rejectWithValue }) => {
        try {
            const user = localStorage.getItem("UserId");
            console.log(user);
            const response = await axios.post(`${API_URL}/createAddress`, 
                {
                    userId: user,
                    orderId: value.orderId,
                    address: value.address,
                    pincode: value.pincode,
                    country: value.country,
                    state: value.state,
                    city: value.city,
                    fullName: value.fullName,
                    contactNo: value.contactNo,
                    addressType: value.addressType,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to create address" });
        }
    }
);

export const getalladdress = createAsyncThunk(
    "address/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/getAllAddress`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch addresses" });
        }
    }
);

export const updateAddress = createAsyncThunk(
    'address/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/updateAddress/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to update address" });
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/deleteAddress/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to delete address" });
        }
    }
);

const AddressSlice = createSlice({
    name: 'address',
    initialState: {
        allAddress: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetAddressState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createaddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createaddress.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allAddress.push(action.payload.data);
            })
            .addCase(createaddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create address';
            })
            .addCase(getalladdress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getalladdress.fulfilled, (state, action) => {
                state.loading = false;
                state.allAddress = action.payload;
                state.error = null;
            })
            .addCase(getalladdress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch addresses';
            })
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.allAddress.findIndex(addr => addr._id === action.payload.data._id);
                if (index !== -1) {
                    state.allAddress[index] = action.payload.data;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update address';
            })
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allAddress = state.allAddress.filter(addr => addr._id !== action.payload.id);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete address';
            });
    },
});

export const { resetAddressState } = AddressSlice.actions;
export default AddressSlice.reducer;