 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetReturnOrderData = createAsyncThunk(
  'getreturnorderdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllReturnOrder`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetReturnOrderData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetReturnOrderData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetReturnOrderData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const ReturnOrderOTP = createAsyncThunk(
  'returnorderotp',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/returnorderOTP`,
        {
            orderId:values?.orderId,
            phone:values?.mobile,
        }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get ReturnOrderOTP Error:", error.message);
      if(error.status === 404){
        console.error("Get ReturnOrderOTP Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get ReturnOrderOTP " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateReturnOrder = createAsyncThunk(
  'createreturnorder',
  async (values, { rejectWithValue }) => {
    const user = localStorage.getItem('UserId');
    console.log('userId',user)
    try {
      const response = await axios.post(`${url}/createReturnOrder`,
        {
            userId:user,
            orderId:values?.orderId,
            reason:values?.returnReason,
            mobileNo:values?.mobile,
            otp:parseInt(values?.otp?.join("")),
        }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateReturnOrder Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateReturnOrder Error:", error?.message);
        let data = [];
         return data; 
      }
      else{
        alert("Get CreateReturnOrder " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditReturnOrder = createAsyncThunk(
  'editreturnorder',
  async ({ id, status}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateReturnOrder/${id}`, {
        status: status
       },
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditReturnOrder Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

// Helper to load status from localStorage
const getInitialStatus = () => {
  try {
    const data = localStorage.getItem('ReturnOrderStatus');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const ReturnOrderSlice = createSlice({
    name: "returnorder",
    initialState: {
      ReturnOrderData:[],
      ReturnOrderStatus: getInitialStatus(),
    },
    reducers: {
      setReturnOrderStatus: (state, action) => {
        const { orderId, status } = action.payload;
        state.ReturnOrderStatus[orderId] = status;
        // Save to localStorage
        localStorage.setItem('ReturnOrderStatus', JSON.stringify(state.ReturnOrderStatus));
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(GetReturnOrderData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(GetReturnOrderData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.ReturnOrderData = action.payload
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(GetReturnOrderData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(ReturnOrderOTP.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(ReturnOrderOTP.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(ReturnOrderOTP.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(CreateReturnOrder.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(CreateReturnOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(CreateReturnOrder.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(EditReturnOrder.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get EditReturnOrder...";
        })
        .addCase(EditReturnOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get EditReturnOrder SuccessFully";
        })
        .addCase(EditReturnOrder.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get EditReturnOrder";
        })
    },
  });
  
export const { setReturnOrderStatus } = ReturnOrderSlice.actions;
export default ReturnOrderSlice.reducer;