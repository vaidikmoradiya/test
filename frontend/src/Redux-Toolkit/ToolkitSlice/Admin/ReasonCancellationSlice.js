import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const createReasonCancellation = createAsyncThunk(
  "createReasonCancellation",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/createReasonCancel`,
        {
          reasonCancel: values?.reasonCancel,
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
      console.error("Create Reason Error:", error.message);
      alert("CreateReason", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const getAllReasonCancellation = createAsyncThunk(
  "allReasonCancellation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllReasonCancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    } catch (error) {
      console.error("Get All Reason Error:", error.message);
      alert("GetAllReason", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditReasonCancellation = createAsyncThunk(
  'editReasonCancellation',
  async ({values , editData}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateReasonCancel/${editData?._id}`, {
        reasonCancel:values?.reasonCancel
      },
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.error("EditReason Cancellation Error:", error.message);
      alert("Edit ReasonCancellation", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditStatusReasonCancellation = createAsyncThunk(
  'editstatusreasoncancellation',
  async ({status , id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateReasonCancel/${id}`, {
          status: status
       },
       {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditStatusReasonCancellation Error:", error.message);
      alert(error?.response?.data?.message)
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteReasonCancellation = createAsyncThunk(
  'deleteReasonCancellation',
  async (deleteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteReasonCancel/${deleteId}`,
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.error("DeleteReason Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const reasonCancellationSlice = createSlice({
  name: "reasonCancellation",
  initialState: {
    reasonCancellation: [],
    allReason: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReasonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(createReasonCancellation.fulfilled, (state, action) => {
        // state.reasonCancellation = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(createReasonCancellation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Reason For Cancellation";
      })

      // all reason
      .addCase(getAllReasonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(getAllReasonCancellation.fulfilled, (state, action) => {
        state.allReason = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(getAllReasonCancellation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed To Create Reason For Cancellation";
      })

      .addCase(EditReasonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(EditReasonCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(EditReasonCancellation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed To Create Reason For Cancellation";
      })

      .addCase(EditStatusReasonCancellation.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditStatusReacan...";
      })
      .addCase(EditStatusReasonCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get EditStatusReacan SuccessFully";
      })
      .addCase(EditStatusReasonCancellation.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditStatusReacan";
      })

      .addCase(DeleteReasonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(DeleteReasonCancellation.fulfilled, (state, action) => {
        state.allReason = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(DeleteReasonCancellation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = action.payload?.message || "Failed To Create Reason For Cancellation";
      })

  },
});

export default reasonCancellationSlice.reducer;
