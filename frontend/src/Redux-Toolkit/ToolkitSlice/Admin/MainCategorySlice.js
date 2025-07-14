import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetMainCateData = createAsyncThunk(
  'getmaincatedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllMainCategory`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get MainCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get MainCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get MainCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateMainCate = createAsyncThunk(
    'createmaincate',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/createMainCategory`, {
            mainCategoryName:values?.mainCategoryName
         },
         {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get CreateMainCate Error:", error.message);
         alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditMainCate = createAsyncThunk(
    'editmaincate',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${url}/upadteMainCategoryById/${editData?._id}`, {
            mainCategoryName:values?.mainCategoryName
         },
         {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get EditMainCate Error:", error.message);
        alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditStatusMainCate = createAsyncThunk(
  'editstatusmaincate',
  async ({status , id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/upadteMainCategoryById/${id}`, {
          status: status
       },
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditMainCate Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteMainCate = createAsyncThunk(
  'deletemaincate',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteMainCategoryById/${deleteId}`,
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteMainCate Error:", error.message);
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
    getMainCategoryData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMainCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get MainCateData...";
      })
      .addCase(GetMainCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getMainCategoryData = action.payload
        state.message = "Get MainCateData SuccessFully";
      })
      .addCase(GetMainCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get MainCateData";
      })

      .addCase(CreateMainCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CreateMainCate...";
      })
      .addCase(CreateMainCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get CreateMainCate SuccessFully";
      })
      .addCase(CreateMainCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CreateMainCate";
      })

      .addCase(EditMainCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditMainCate...";
      })
      .addCase(EditMainCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get EditMainCate SuccessFully";
      })
      .addCase(EditMainCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditMainCate";
      })

      .addCase(EditStatusMainCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditMainCate...";
      })
      .addCase(EditStatusMainCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get EditMainCate SuccessFully";
      })
      .addCase(EditStatusMainCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditMainCate";
      })

      .addCase(DeleteMainCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DeleteMainCate...";
      })
      .addCase(DeleteMainCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get DeleteMainCate SuccessFully";
      })
      .addCase(DeleteMainCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DeleteMainCate";
      })
  },
});

export default MainCategorySlice.reducer;
