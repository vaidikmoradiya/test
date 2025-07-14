import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetAllReview = createAsyncThunk(
  'getallreview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllreview`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllReview Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllReview Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetAllReview " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetSingleReviewData = createAsyncThunk(
  'getsinglereviewdata',
  async (editid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getReviewById/${editid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetSingleReviewData Error:", error.message);
      if(error.status === 404){
        console.error("Get GetSingleReviewData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetSingleReviewData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateReview = createAsyncThunk(
  'createreview',
  async (value, { rejectWithValue }) => {
    try {
      console.log('reviewvalue',value);
      const response = await axios.post(`${url}/createReview`,{
        userId: value.userId,
        productId : value.id,
        rate: value.rating,
        description:value.comment
      } ,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      // console.log("nlololoojlolj",response.data.data);
      return response?.data?.data;
    } catch (error) {
      console.error("CreateReview Error:", error.message);
      if(error.status === 400){
        console.error("CreateReview Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("CreateReview " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
      
    }
  }
);

export const DeleteReviewData = createAsyncThunk(
  'deletereviewdata',
  async (deleteId, { rejectWithValue }) => {
    // console.log(values , id);
    try {
      const response = await axios.delete(`${url}/deleteReview/${deleteId}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get DeleteReviewData Error:", error.message);
      if(error.status === 404){
        console.error("Get DeleteReviewData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get DeleteReviewData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const ReviewSlice = createSlice({
  name: "review",
  initialState: {
    allReviewData:[],
    GetSingleReviewData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllReview.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetAllReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allReviewData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetAllReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(GetSingleReviewData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetSingleReviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetSingleReviewData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetSingleReviewData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(CreateReview.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(CreateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.allReviewData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(CreateReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })

      .addCase(DeleteReviewData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(DeleteReviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(DeleteReviewData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default ReviewSlice.reducer;
