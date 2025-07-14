import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";

export const LoginAdmin = createAsyncThunk(
  'loginAdmin',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, {
        email: values?.email,
        password: values?.password,
        isAdmin: true // Add this flag for admin login
      });
      localStorage.setItem("login", response?.data?.token);
      localStorage.setItem("adminId", response?.data?.user?._id);
      alert("Login SuccessFully")
      return response.data;
    } catch (error) {
      console.error("LoginAdmin Error:", error.message);
      alert("Login", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const ForgetPass = createAsyncThunk(
    'forgetpass',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/forgotPassword`, {
          email: values?.email,
        });
        localStorage.setItem("email" , values?.email)
        return response.data;
      } catch (error) {
        console.error("ForgetPass Error:", error.message);
        alert("ForgetPass", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const VerifyOtp = createAsyncThunk(
    'verifyotp',
    async (finalOtp, { rejectWithValue }) => {
      const email = localStorage.getItem("email")
      try {
        const response = await axios.post(`${url}/verifyOtp`, {
          email:email,
          otp:finalOtp
        });
        return response.data;
      } catch (error) {
        console.error("VerifyOtp Error:", error.message);
        alert("VerifyOtp Invalid Otp" , error.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);
  
export const ResendOtp = createAsyncThunk(
  'resendotp',
  async (_, { rejectWithValue }) => {
    const email = localStorage.getItem("email")
    try {
      const response = await axios.post(`${url}/resendOtp`, {
        email:email,
      });
      return response.data;
    } catch (error) {
      console.error("ResendOtp Error:", error.message);
      alert("ResendOtp Invalid Otp" , error.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const ResetPass = createAsyncThunk(
  'resetpass',
  async (values, { rejectWithValue }) => {
    const email = localStorage.getItem("email")
    try {
      const response = await axios.post(`${url}/resetPassword`, {
         newPassword:values?.newPass,
         confirmPassword:values?.confirmPass,
         email:email
      });
      return response.data;
    } catch (error) {
      console.error("ResetPass Error:", error.message);
      alert("ResetPass Invalid Otp" , error.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const LoginSlice = createSlice({
  name: "login",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(LoginAdmin.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Login Admin...";
      })
      .addCase(LoginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Login SuccessFully";
      })
      .addCase(LoginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Login";
      })

      .addCase(ForgetPass.pending, (state) => {
        state.loading = true;
        state.message = "Accepting ForgetPass...";
      })
      .addCase(ForgetPass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "ForgetPass SuccessFully";
      })
      .addCase(ForgetPass.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To ForgetPass";
      })

      .addCase(VerifyOtp.pending, (state) => {
        state.loading = true;
        state.message = "Accepting VerifyOtp...";
      })
      .addCase(VerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "VerifyOtp SuccessFully";
      })
      .addCase(VerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To VerifyOtp";
      })

      .addCase(ResendOtp.pending, (state) => {
        state.loading = true;
        state.message = "Accepting ResendOtp...";
      })
      .addCase(ResendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "ResendOtp SuccessFully";
      })
      .addCase(ResendOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To ResendOtp";
      })

      .addCase(ResetPass.pending, (state) => {
        state.loading = true;
        state.message = "Accepting ResetPass...";
      })
      .addCase(ResetPass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "ResetPass SuccessFully";
      })
      .addCase(ResetPass.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To ResetPass";
      });
  },
});

export default LoginSlice.reducer;
