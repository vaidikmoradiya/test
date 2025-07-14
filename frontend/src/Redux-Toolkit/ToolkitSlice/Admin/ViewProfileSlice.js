import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetSingleUserData = createAsyncThunk(
    'getsingleuserdata',
    async (editid, { rejectWithValue }) => {
      try {
        var adminId = localStorage.getItem('adminId')
        const response = await axios.get(`${url}/getUserById/${adminId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get GetSingleUserData Error:", error.message);
        if(error.status === 404){
          console.error("Get GetSingleUserData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get GetSingleUserData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditUserData = createAsyncThunk(
    'edituserdata',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append('firstName', values?.firstName);
        formData.append('lastName', values?.lastName);
        formData.append('email', values?.email);
        formData.append('mobileNo', values?.contactNo);
        formData.append('gender', values?.gender);
        
        // Only append image if a new one is selected
        if (values.profilePhotoFile) {
          formData.append('image', values.profilePhotoFile);
        }

        const response = await axios.put(`${url}/updateUserById/${editData?._id}`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get EditUserData Error:", error.message);
        if(error.status === 404){
          console.error("Get EditUserData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get EditUserData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const ChangePassData = createAsyncThunk(
  'changepassdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/changePassword`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      console.log("bcubufvfjv",response);
      return response?.data?.data;
      
    } catch (error) {
      console.error("Get ChangePassData Error:", error.message);
      if(error.status === 404){
        console.error("Get ChangePassData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get ChangePassData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

  const ViewProfileSlice = createSlice({
    name: "profile",
    initialState: {
        GetSingleUserData:{},
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(GetSingleUserData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(GetSingleUserData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.GetSingleUserData = action.payload
          state.message = "Get CateData SuccessFully";
        })
        .addCase(GetSingleUserData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(EditUserData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(EditUserData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(EditUserData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(ChangePassData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(ChangePassData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(ChangePassData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

    },
});

export default ViewProfileSlice.reducer;