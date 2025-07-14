import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const createFaq = createAsyncThunk(
  "createFaq",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/createFaq`,
        {
          categoryId: values?.categoryName,
          faqQuestion: values?.faqQuestion,
          faqAnswer: values?.faqAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response?.data?.data;
    } catch (error) {
      console.error("Create FAQ's Error:", error.message);
      alert("Create FAQ's", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditFaq = createAsyncThunk(
  "editFaq",
  async ({ values, editData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/updateFaq/${editData?._id}`,
        {
          categoryId: values?.categoryName,
          faqQuestion: values?.faqQuestion,
          faqAnswer: values?.faqAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Edit FAQ's Error:", error.message);
      alert("Edit FAQ's", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const getAllFaq = createAsyncThunk(
  "allFaq",
  async (_, { rejectWithValue }) => {
    console.log("ghhhhh");
    
    try {
      const response = await axios.get(`${url}/getAllFaq`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",response); 
      
      return response?.data;
    } catch (error) {
      console.error("Get All FAQ's Error:", error.message);
      alert("GetAll FAQ's", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteFaq = createAsyncThunk(
  "deleteFaq",
  async (deleteId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${url}/deleteFaq/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getAllFaq());
      return response?.data?.data;
    } catch (error) {
      console.error("Delete FAQ's Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faq: [],
    allFaq: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        // state.faq = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Reason For Cancellation";
      })

      // all reason
      .addCase(getAllFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(getAllFaq.fulfilled, (state, action) => {
        state.allFaq = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(getAllFaq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Reason For Cancellation";
      });
  },
});

export default faqSlice.reducer;
