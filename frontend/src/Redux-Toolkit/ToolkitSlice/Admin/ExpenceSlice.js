import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetExpenceData = createAsyncThunk(
  'getexpencedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/expence`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetExpenceData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetExpenceData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetExpenceData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateExpence = createAsyncThunk(
    'createexpence',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/expence`, {
            expenceName:values?.expenceName,
            price:values?.price,
         },
         {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get CreateExpence Error:", error.message);
         alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditExpence = createAsyncThunk(
    'editexpence',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${url}/expence/${editData?._id}`, {
          expenceName:values?.expenceName,
          price:values?.price,
        },
        {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get EditExpence Error:", error.message);
        alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const DeleteExpence = createAsyncThunk(
  'deleteexpence',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/expence/${deleteId}`,
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteExpence Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const MainCategorySlice = createSlice({
  name: "maincategory",
  initialState: {
    getExpData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetExpenceData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get MainCateData...";
      })
      .addCase(GetExpenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getExpData = action.payload
        state.message = "Get MainCateData SuccessFully";
      })
      .addCase(GetExpenceData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get MainCateData";
      })

      .addCase(CreateExpence.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CreateExpence...";
      })
      .addCase(CreateExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get CreateExpence SuccessFully";
      })
      .addCase(CreateExpence.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CreateExpence";
      })

      .addCase(EditExpence.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditExpence...";
      })
      .addCase(EditExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get EditExpence SuccessFully";
      })
      .addCase(EditExpence.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditExpence";
      })

      .addCase(DeleteExpence.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DeleteExpence...";
      })
      .addCase(DeleteExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get DeleteExpence SuccessFully";
      })
      .addCase(DeleteExpence.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DeleteExpence";
      })
  },
});

export default MainCategorySlice.reducer;
