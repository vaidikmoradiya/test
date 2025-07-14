import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetCateData = createAsyncThunk(
  'getcatedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllCategory`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateCateData = createAsyncThunk(
  'createcatedata',
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('mainCategoryId', values?.mainCateId);
      formData.append('categoryName', values?.cateName);
      // Handle images (array or single)
      if (values.img) {
        if (Array.isArray(values.img)) {
          values.img.forEach(file => {
            formData.append('image', file);
          });
        } else {
          formData.append('image', values.img);
        }
      }
      const response = await axios.post(`${url}/createCategory`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get CreateCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditCateData = createAsyncThunk(
  'editcatedata',
  async ({values, id}, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('mainCategoryId', values?.mainCateId);
      formData.append('categoryName', values?.cateName);
      // Only append new files (not existing image paths)
      if (values.img && Array.isArray(values.img)) {
        values.img.forEach(item => {
          if (item instanceof File) {
            formData.append('image', item);
          }
        });
      }
      const response = await axios.put(`${url}/updateCategory/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditStatusCateData = createAsyncThunk(
  'editstatuscatedata',
  async ({status, id}, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.put(`${url}/updateCategory/${id}`, {
        status: status
      } , {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStatusCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditStatusCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditStatusCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteCateData = createAsyncThunk(
  'deletecatedata',
  async (deleteId, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.delete(`${url}/deleteCategoryById/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const CategorySlice = createSlice({
  name: "category",
  initialState: {
    getCategoryData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getCategoryData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(CreateCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(CreateCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getCategoryData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(CreateCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(EditCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(EditCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getCategoryData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(EditCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(EditStatusCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(EditStatusCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getCategoryData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(EditStatusCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(DeleteCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(DeleteCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getCategoryData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(DeleteCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default CategorySlice.reducer;
