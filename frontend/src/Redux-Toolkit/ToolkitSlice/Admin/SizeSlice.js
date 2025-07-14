import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetSizeData = createAsyncThunk(
  'getsizedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllSize`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetSizeData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetSizeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetSizeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetSingleSizeData = createAsyncThunk(
  'getsinglesizedata',
  async (editid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getSizeById/${editid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetSingleSizeData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetSingleSizeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetSingleSizeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateSizeData = createAsyncThunk(
  'createsizedata',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/createSize`,
        {
            mainCategoryId:values?.mainCateId,
            categoryId:values?.cateName,
            subCategoryId:values?.SubcateName,
            sizeName:values?.sizeName,
            size:values?.size,
            unitId:values?.unit,
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateSizeData Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateSizeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get CreateSizeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditSizeData = createAsyncThunk(
  'editsizedata',
  async ({values, id}, { rejectWithValue }) => {    
    try {
      const response = await axios.put(`${url}/updateSizeById/${id}`,
        {
            mainCategoryId:values?.mainCateId,
            categoryId:values?.cateName,
            subCategoryId:values?.SubcateName,
            sizeName:values?.sizeName,
            size:values?.size,
            unitId:values?.unit,
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditSizeData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditSizeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get EditSizeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteSizeData = createAsyncThunk(
  'deletesizedata',
  async (deleteId, { rejectWithValue }) => {    
    try {
      const response = await axios.delete(`${url}/deleteSizeById/${deleteId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteSizeData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteSizeData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteSizeData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const SizeSlice = createSlice({
    name: "size",
    initialState: {
      getsizeData:[],
      getSingleSizeData:{},
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(GetSizeData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(GetSizeData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.getsizeData = action.payload
          state.message = "Get CateData SuccessFully";
        })
        .addCase(GetSizeData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(GetSingleSizeData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(GetSingleSizeData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.getSingleSizeData = action.payload
          state.message = "Get CateData SuccessFully";
        })
        .addCase(GetSingleSizeData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(CreateSizeData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(CreateSizeData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(CreateSizeData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(EditSizeData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(EditSizeData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(EditSizeData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })

        .addCase(DeleteSizeData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(DeleteSizeData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(DeleteSizeData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })
    },
});

export default SizeSlice.reducer;