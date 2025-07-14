import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetDashboardData = createAsyncThunk(
  'getdashboarddata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getdashboard`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetDashboardData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetDashboardData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetDashboardData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetOrderSummaryData = createAsyncThunk(
  'getordersummarydata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getordersummary`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetOrderSummaryData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetOrderSummaryData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetOrderSummaryData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetIncomeData = createAsyncThunk(
  'getincomedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getincome`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data;
    } catch (error) {
      console.error("Get GetIncomeData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetIncomeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetIncomeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetRevenuebyLocation = createAsyncThunk(
  'getrevenuebylocation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getrevenuebylocation`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetRevenuebyLocation Error:", error.message);
      if(error.status === 404){
        console.error("Get GetRevenuebyLocation Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetRevenuebyLocation " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    getDashboardData:[],
    getOrderSummaryData:[],
    getIncomeData:[],
    GetRevenuebyLocation:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetDashboardData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DashboardData...";
      })
      .addCase(GetDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getDashboardData = action.payload
        state.message = "Get DashboardData SuccessFully";
      })
      .addCase(GetDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DashboardData";
      })

      .addCase(GetOrderSummaryData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DashboardData...";
      })
      .addCase(GetOrderSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getOrderSummaryData = action.payload
        state.message = "Get DashboardData SuccessFully";
      })
      .addCase(GetOrderSummaryData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DashboardData";
      })

      .addCase(GetIncomeData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DashboardData...";
      })
      .addCase(GetIncomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getIncomeData = action.payload
        state.message = "Get DashboardData SuccessFully";
      })
      .addCase(GetIncomeData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DashboardData";
      })

      .addCase(GetRevenuebyLocation.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DashboardData...";
      })
      .addCase(GetRevenuebyLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetRevenuebyLocation = action.payload
        state.message = "Get DashboardData SuccessFully";
      })
      .addCase(GetRevenuebyLocation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DashboardData";
      })

  },
});

export default DashboardSlice.reducer;
