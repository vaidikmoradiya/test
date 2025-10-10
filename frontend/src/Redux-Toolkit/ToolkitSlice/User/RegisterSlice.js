import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
const url = "http://localhost:5000/api";

// import axios from "axios";

export const register = createAsyncThunk('register',
    async ( value , { rejectWithValue }) => {
        try {
            console.log('valuedaaata',value)
            const response = await axiosInstance.post(`${url}/register`,{
                firstName: value.firstname,
                lastName: value.lastname,
                email: value.email,
                password: value.password,
                // role:"user"
            },
        )
        return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const verifyOtp = createAsyncThunk('verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${url}/verifyOtp`, {
                email,
                otp
            });
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resendOtp = createAsyncThunk('resendOtp',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${url}/resendOtp`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to resend OTP' });
        }
    }
);

export const forgotPassword = createAsyncThunk('forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${url}/forgotPassword`, {
                email
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const registerSlice = createSlice({
    name:'register',
    initialState: {
        user:[],
        otpVerified: false,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false

    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled,(state, action) => {
            state.loading = false;
            state.success = true;
            // state.message = "Login User SuccessFully";
            console.log('data',action.payload)
            localStorage.setItem("UserId",action.payload.data.id);
            state.user = action.payload.data;
        })
        .addCase(verifyOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(verifyOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.otpVerified = true;
            state.user = action.payload.user;
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.error || 'OTP verification failed';
        })
        // resend otp
        .addCase(resendOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resendOtp.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(resendOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to resend OTP';
        })
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.forgotPasswordSuccess = true;
            state.success = action.payload.status;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to send OTP';
        })
    }
})
  


  
export default registerSlice.reducer;