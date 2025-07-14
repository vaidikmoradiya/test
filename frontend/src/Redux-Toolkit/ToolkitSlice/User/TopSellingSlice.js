import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetBestSeller = createAsyncThunk(
  'Getbestseller',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/bestSellerProducts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetBestSeller Error:", error.message);
      if(error.status === 404){
        console.error("Get GetBestSeller Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetBestSeller " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const TopSellingSlice = createSlice({
  name: "topselling",
  initialState: {
    allTopSellingData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetBestSeller.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetBestSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allTopSellingData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetBestSeller.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default TopSellingSlice.reducer;
