import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetSubCateData = createAsyncThunk(
  'getsubcatedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllSubCategory`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get SubCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get SubCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get SubCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateSubCateData = createAsyncThunk(
  'createsubcatedata',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/createSubCategory`,{
        mainCategoryId:values?.mainCateId,
        categoryId:values?.cateName,
        subCategoryName:values?.SubcateName,
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateSubCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateSubCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get CreateSubCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditSubCateData = createAsyncThunk(
  'editsubcatedata',
  async ({values, id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateSubCategory/${id}`, {
         mainCategoryId:values?.mainCateId,
         categoryId:values?.cateName,
         subCategoryName:values?.SubcateName,
      } , {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditSubCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditSubCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditSubCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditStatusSubCateData = createAsyncThunk(
  'editstatussubcatedata',
  async ({status, id}, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.put(`${url}/updateSubCategory/${id}`, {
        status: status
      } , {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStatusSubCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditStatusSubCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditStatusSubCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteSubCateData = createAsyncThunk(
  'deletesubcatedata',
  async (deleteId, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.delete(`${url}/deleteSubCategoryById/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteSubCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteSubCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteSubCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const SubCategorySlice = createSlice({
    name: "subcategory",
    initialState: {
      getSubCategoryData:[],
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(GetSubCateData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(GetSubCateData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.getSubCategoryData = action.payload;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(GetSubCateData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(CreateSubCateData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(CreateSubCateData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(CreateSubCateData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(EditSubCateData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(EditSubCateData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(EditSubCateData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(EditStatusSubCateData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(EditStatusSubCateData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(EditStatusSubCateData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })

        .addCase(DeleteSubCateData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get MainCateData...";
        })
        .addCase(DeleteSubCateData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          // console.log('heloooo',action.payload)
          state.message = "Get MainCateData SuccessFully";
        })
        .addCase(DeleteSubCateData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get MainCateData";
        })
    },
});

export default SubCategorySlice.reducer;