import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetAllStock = createAsyncThunk(
  'getallstock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllStocks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllStock Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllStock Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetAllStock " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateStock = createAsyncThunk(
  'createstock',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/createStock`,{
        mainCategory:values?.mainCateId,
        category:values?.cateName,
        subCategory:values?.SubcateName,
        product:values?.product,
        stockStatus:values?.stockStatus,
        qty:values?.qty,
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateStock Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateStock Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get CreateStock " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetSingleStockData = createAsyncThunk(
  'getsinglesingledata',
  async (editid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getStockById/${editid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetSingleStockData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetSingleStockData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetSingleStockData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditStockData = createAsyncThunk(
  'editstockdata',
  async ({values, id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateStock/${id}`, {
        mainCategory:values?.mainCateId,
        category:values?.cateName,
        subCategory:values?.SubcateName,
        product:values?.product,
        stockStatus:values?.stockStatus,
        qty:values?.qty,
      } , {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStockData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditStockData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditStockData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteStockData = createAsyncThunk(
  'deletestockdata',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteStockById/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteStockData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteStockData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteStockData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const StockSlice = createSlice({
    name: "Product",
    initialState: {
      StockData:[],
      GetSingleStockData:[],
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(GetAllStock.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(GetAllStock.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.StockData = action.payload
          state.message = "Get CateData SuccessFully";
        })
        .addCase(GetAllStock.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(GetSingleStockData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(GetSingleStockData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.GetSingleStockData = action.payload
          state.message = "Get CateData SuccessFully";
        })
        .addCase(GetSingleStockData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(CreateStock.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(CreateStock.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(CreateStock.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(EditStockData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(EditStockData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(EditStockData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(DeleteStockData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(DeleteStockData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(DeleteStockData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })
    },
});

export default StockSlice.reducer;