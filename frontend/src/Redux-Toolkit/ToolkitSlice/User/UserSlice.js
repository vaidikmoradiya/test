import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const GetUserData = createAsyncThunk(
  'getuserdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllUsers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      console.log("bcubufvfjv",response);
      return response?.data?.data;
      
    } catch (error) {
      console.error("Get GetUserData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetUserData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetUserData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const updateUserData = createAsyncThunk(
  'updateUserData',
  async (value, { rejectWithValue }) => {

    const formData = new FormData();
    formData.append('email', value.email || '');
    formData.append('firstName', value.firstName || '');
    formData.append('lastName', value.lastName || '');
    formData.append('mobileNo', value.mobileNo || '');
    formData.append('image', value.profilePhotoFile || value.profilePhoto);

    console.log('useruser',value);
    try {
      const response = await axios.put(`${url}/updateUserById/`+value.id,formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetUserData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetUserData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetUserData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteUserData = createAsyncThunk(
  'deleteuserdata',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteUserById/${deleteId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteUserData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteUserData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteUserData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    allUserData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetUserData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allUserData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(DeleteUserData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(DeleteUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.allUserData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(DeleteUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default UserSlice.reducer;
