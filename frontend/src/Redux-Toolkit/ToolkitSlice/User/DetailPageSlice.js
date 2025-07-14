import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetProductById = createAsyncThunk(
  'getproductbyid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getProductById/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetProductById Error:", error.message);
      if(error.status === 404){
        console.error("Get GetProductById Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetProductById " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const DetailPageSlice = createSlice({
  name: "detail",
  initialState: {
    GetProductByIdData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetProductById.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetProductByIdData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetProductById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default DetailPageSlice.reducer;
