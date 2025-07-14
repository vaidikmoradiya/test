import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetFaqCateData = createAsyncThunk(
  'getmaincatedata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllFaqCategories`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetFaqCateData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetFaqCateData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetFaqCateData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateFaqCate = createAsyncThunk(
    'createfaqcate',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/createFaqCategory`, {
            categoryName:values?.categoryName
         },
         {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get CreateFaqCate Error:", error.message);
         alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditFaqCate = createAsyncThunk(
    'editfaqcate',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${url}/updateFaqCategory/${editData?._id}`, {
            categoryName:values?.categoryName
         },
         {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get EditFaqCate Error:", error.message);
        alert(error?.response?.data?.message)
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditStatusFaqCate = createAsyncThunk(
  'editstatusfaqcate',
  async ({status , id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateFaqCategory/${id}`, {
          status: status
       },
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStatusFaqCate Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteFaqCate = createAsyncThunk(
  'deletefaqcate',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteFaqCategory/${deleteId}`,
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteFaqCate Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const MainCategorySlice = createSlice({
  name: "faqcategory",
  initialState: {
    getFaqCategoryData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetFaqCateData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get MainCateData...";
      })
      .addCase(GetFaqCateData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getFaqCategoryData = action.payload
        state.message = "Get MainCateData SuccessFully";
      })
      .addCase(GetFaqCateData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get MainCateData";
      })

      .addCase(CreateFaqCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CreateMainCate...";
      })
      .addCase(CreateFaqCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get CreateMainCate SuccessFully";
      })
      .addCase(CreateFaqCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CreateMainCate";
      })

      .addCase(EditFaqCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditFaqCate...";
      })
      .addCase(EditFaqCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get EditFaqCate SuccessFully";
      })
      .addCase(EditFaqCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditFaqCate";
      })

      .addCase(EditStatusFaqCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditMainCate...";
      })
      .addCase(EditStatusFaqCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get EditMainCate SuccessFully";
      })
      .addCase(EditStatusFaqCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditMainCate";
      })

      .addCase(DeleteFaqCate.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DeleteFaqCate...";
      })
      .addCase(DeleteFaqCate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getMainCategoryData = action.payload
        state.message = "Get DeleteFaqCate SuccessFully";
      })
      .addCase(DeleteFaqCate.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DeleteFaqCate";
      })
  },
});

export default MainCategorySlice.reducer;
