import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:5000/api";

export const getAllServices = createAsyncThunk(
    "services/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${url}/services`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch services" });
        }
    }
);

const initialState = {
    services: [],
    loading: false,
    error: null
};

const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(getAllServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch services";
            });
    }
});

export default serviceSlice.reducer; 