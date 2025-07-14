import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetAllOrderData = createAsyncThunk(
  'getallorderdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllOrder`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllOrderData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllOrderData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetAllOrderData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetOrderData = createAsyncThunk(
  'getorderdata',
  async (editid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getOrderById/${editid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetOrderData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetOrderData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetOrderData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteOrderData = createAsyncThunk(
  'deleteorderdata',
  async (deleteId, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.delete(`${url}/deleteOrder/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteOrderData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteOrderData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteOrderData " , error.message)
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
    allOrderData:[],
    GetSingleOrderData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllOrderData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetAllOrderData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allOrderData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetAllOrderData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(GetOrderData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetOrderData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetSingleOrderData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetOrderData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(DeleteOrderData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(DeleteOrderData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(DeleteOrderData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default OrderSlice.reducer;
