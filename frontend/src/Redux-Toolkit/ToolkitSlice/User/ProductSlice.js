import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetAllProduct = createAsyncThunk(
  'getallproduct',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllProduct`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllProduct Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllProduct Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetAllProduct " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateProduct = createAsyncThunk(
  'createproduct',
  async (values, { rejectWithValue }) => {
    try {
      console.log('data',values)
      const formData = new FormData();
      formData.append('mainCategoryId', values?.mainCateId);
      formData.append('categoryId', values?.cateName);
      formData.append('subCategoryId', values?.SubcateName);
      formData.append('productName', values?.productName);
      formData.append('sizeNameId', values?.sizeName);
      formData.append('size', values?.size);
      // Convert unit array to comma-separated string
      const unitString = Array.isArray(values?.unit) ? values.unit.join(',') : values?.unit || '';
      formData.append('unit', unitString);
      formData.append('stockStatus', values?.stockStatus);
      formData.append('price', values?.price);
      formData.append('discount', values?.discount);

      // Append multiple images
      if (values.productImage && Array.isArray(values.productImage)) {
        values.productImage.forEach(file => {
          formData.append('productImage', file);
        });
      }

      formData.append('shortDescription', values?.shortDescription);
      formData.append('description', values?.description);
      // formData.append('data', values?.fields);
      values.fields.forEach((item, id) => {
        console.log('type', typeof item, item);
        formData.append(`data[${id}]`, JSON.stringify(item)); 
      });
      console.log('formData',formData)
      const response = await axios.post(`${url}/createProduct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateProduct Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateProduct Error:", error?.message);
        let data = [];
        return data;
      }
      else{
        alert("Get CreateProduct ", error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetSingleProductData = createAsyncThunk(
  'getsingleproductdata',
  async (editid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getProductById/${editid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetSingleProductData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetSingleProductData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetSingleProductData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditProduct = createAsyncThunk(
  'editproduct',
  async ({values, id}, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('mainCategoryId', values?.mainCateId);
      formData.append('categoryId', values?.cateName);
      formData.append('subCategoryId', values?.SubcateName);
      formData.append('productName', values?.productName);
      formData.append('sizeNameId', values?.sizeName);
      formData.append('size', values?.size);
      // Convert unit array to comma-separated string
      const unitString = Array.isArray(values?.unit) ? values.unit.join(',') : values?.unit || '';
      formData.append('unit', unitString);
      formData.append('stockStatus', values?.stockStatus);
      formData.append('price', values?.price);
      formData.append('discount', values?.discount);
      // Append multiple images
      if (values.productImage && Array.isArray(values.productImage)) {
        values.productImage.forEach(file => {
          formData.append('productImage', file);
        });
      }
      formData.append('shortDescription', values?.shortDescription);
      formData.append('description', values?.description);
      values.fields.forEach((item, id) => {
        console.log('type', typeof item, item);
        formData.append(`data[${id}]`, JSON.stringify(item)); 
      });
      const response = await axios.put(`${url}/updateProduct/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditProduct Error:", error.message);
      if(error.status === 404){
        console.error("Get EditProduct Error:", error?.message);
        let data = [];
        return data;
      }
      else{
        alert("Get EditProduct ", error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditStatusProductData = createAsyncThunk(
  'editstatusproductdata',
  async ({status, id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateProduct/${id}`, {
        status: status
      } , {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStatusProductData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditStatusProductData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditStatusProductData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteProductData = createAsyncThunk(
  'deleteproductdata',
  async (deleteId, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.delete(`${url}/deleteProduct/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteProductData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteProductData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteProductData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const ProductSlice = createSlice({
  name: "Product",
  initialState: {
    allProductData:[],
    GetSingleProductData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProduct.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allProductData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(GetSingleProductData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetSingleProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetSingleProductData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetSingleProductData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(CreateProduct.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(CreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(CreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
      
      .addCase(EditProduct.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(EditProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(EditProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(EditStatusProductData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(EditStatusProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(EditStatusProductData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(DeleteProductData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(DeleteProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(DeleteProductData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default ProductSlice.reducer;
