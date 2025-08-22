import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const createPrivacyPolicy = createAsyncThunk(
  "createPrivacyPolicy",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/createPrivacyPolicy`,
        {
          title: values?.title,
          description: values?.description,
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
      console.error("Create Privacy Policy Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to create privacy policy" }
      );
    }
  }
);

export const EditPrivacyPolicy = createAsyncThunk(
  "editPrivacyPolicy",
  async ({ values, editData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/updatePrivacyPolicy/${editData?._id}`,
        {
          title: values?.title,
          description: values?.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Edit Privacy Policy Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update privacy policy" }
      );
    }
  }
);

export const getAllPrivacyPolicy = createAsyncThunk(
  "allPrivacyPolicy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllPrivacyPolicy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.error("Get All Privacy Policy Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch privacy policies" }
      );
    }
  }
);

export const DeletePrivacyPolicy = createAsyncThunk(
  "deletePrivacyPolicy",
  async (deleteId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(
        `${url}/deletePrivacyPolicy/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(getAllPrivacyPolicy());
      return response?.data?.data;
    } catch (error) {
      console.error("Delete Privacy Policy Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete privacy policy" }
      );
    }
  }
);

const privacyPolicySlice = createSlice({
  name: "privacyPolicy",
  initialState: {
    privacyPolicy: [],
    allPrivacyPolicy: [],
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed to create privacy policy";
      })

      // Edit privacy policy
      .addCase(EditPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EditPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(EditPrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed to update privacy policy";
      })

      // Get all privacy policies
      .addCase(getAllPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPrivacyPolicy.fulfilled, (state, action) => {
        state.allPrivacyPolicy = action.payload || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllPrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed to fetch privacy policies";
      })

      // Delete privacy policy
      .addCase(DeletePrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeletePrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(DeletePrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed to delete privacy policy";
      });
  },
});

export const { clearError } = privacyPolicySlice.actions;
export default privacyPolicySlice.reducer;
