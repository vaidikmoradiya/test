import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";


export const LoginUser = createAsyncThunk(
  'loginuser',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, {
        email: values?.email,
        password: values?.password,
        isAdmin: false // Add this flag for user login
      });
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("UserId", response?.data?.user?._id);
      return response.data;
    } catch (error) {
      console.error("LoginUser Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

  export const GoogleUser = createAsyncThunk(
    'googleuser',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/sociallogin`, {
            firstName:values?.fullName,
            email:values?.email
        });
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("UserId", response?.data?.user?._id);
        return response.data;
      } catch (error) {
        console.error("LoginUser Error:", error.message);
        // alert("LoginUser", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const ForgetPassword = createAsyncThunk(
    'forgetpass',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/forgotPassword`, {
            email: values?.email
        });
        return response.data;
      } catch (error) {
        console.error("ForgetPass Error:", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const ResetPasswordd = createAsyncThunk(
    'resetpassword',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/resetPassword`, {
            email: values?.email,
            newPassword: values?.password,
            confirmPassword: values?.newpassword
        });
        return response.data;
      } catch (error) {
        console.error("ResetPassword Error:", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const ChangePassword = createAsyncThunk(
    'changepassword',
    async (values, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('login');
        if (!token) {
          return rejectWithValue({ message: "No authentication token found" });
        }

        const response = await axios.post(`${url}/changePassword`, {
          currentPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error("ChangePassword Error:", error.message);
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
        .addCase(LoginUser.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Login User...";
        })
        .addCase(LoginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Login User SuccessFully";
        })
        .addCase(LoginUser.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Login User";
        })

        .addCase(GoogleUser.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Login User...";
        })
        .addCase(GoogleUser.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Login User SuccessFully";
        })
        .addCase(GoogleUser.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Login User";
        })

        .addCase(ForgetPassword.pending, (state) => {
          state.loading = true;
          state.message = "Sending OTP...";
        })
        .addCase(ForgetPassword.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "OTP sent successfully";
        })
        .addCase(ForgetPassword.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed to send OTP";
        })
        .addCase(ResetPasswordd.pending, (state) => {
          state.loading = true;
          state.message = "Resetting password...";
        })
        .addCase(ResetPasswordd.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Password reset successfully";
        })
        .addCase(ResetPasswordd.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed to reset password";
        })
        .addCase(ChangePassword.pending, (state) => {
          state.loading = true;
          state.message = "Changing password...";
        })
        .addCase(ChangePassword.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Password changed successfully";
        })
        .addCase(ChangePassword.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed to change password";
        });
    },
  });
  
  export default LoginSlice.reducer;