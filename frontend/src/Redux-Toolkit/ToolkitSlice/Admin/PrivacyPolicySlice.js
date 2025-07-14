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
      alert("Create Privacy Policy", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
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
      alert("Edit Privacy Policy", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
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
      alert("GetAll Privacy Policy", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
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
        error.response?.data || { message: "Unexpected error occurred" }
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Privacy Policy";
      })
      .addCase(createPrivacyPolicy.fulfilled, (state, action) => {
        // state.privacyPolicy = action.payload;
        state.loading = false;
        state.message = "Create Privacy Policy SuccessFully";
      })
      .addCase(createPrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Privacy Policy";
      })

      // all reason
      .addCase(getAllPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Privacy Policy";
      })
      .addCase(getAllPrivacyPolicy.fulfilled, (state, action) => {
        state.allPrivacyPolicy = action.payload;
        state.loading = false;
        state.message = "Create Privacy Policy SuccessFully";
      })
      .addCase(getAllPrivacyPolicy.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Privacy Policy";
      });
  },
});

export default privacyPolicySlice.reducer;
