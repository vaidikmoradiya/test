import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetAllCancelOrder = createAsyncThunk(
  'getallcancelorder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${url}/getAllcancleorder`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllCancelOrder Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllCancelOrder Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        // alert("Get GetAllCancelOrder " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const cancleOrder = createAsyncThunk(
  'cancleorder',
  async ( value , { rejectWithValue }) => {
    try {
      const Userid = localStorage.getItem('UserId');
      const response = await axiosInstance.post(`${url}/createCancleOrder`, {
          userId: Userid,
          orderId: value.orderId,
          reason: value.reason,
          comment: value.comment,
        },{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      return response?.data?.data;
    } catch (error) {
      console.error("Get cancleOrder Error:", error.message);
      if(error.status === 404){
        console.error("Get cancleOrder Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        // alert("Get cancleOrder " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const OrderSlice = createSlice({
  name: "user",
  initialState: {
    cancleOrderData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cancleOrder.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(cancleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cancleOrderData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(cancleOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(GetAllCancelOrder.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetAllCancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cancleOrderData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetAllCancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default OrderSlice.reducer;
