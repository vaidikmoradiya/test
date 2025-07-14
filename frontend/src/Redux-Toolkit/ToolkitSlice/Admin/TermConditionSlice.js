import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const createTermCondition = createAsyncThunk(
  "createTermCondition",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/createTermCondition`,
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
      console.error("Create Term & Condition Error:", error.message);
      alert("Create Term & Condition", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


export const EditTermCondition = createAsyncThunk(
    'editTermCondition',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${url}/updateTermCondition/${editData?._id}`, {
          title:values?.title,
          description: values?.description
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

export const getAllTermCondition = createAsyncThunk(
    "allTermCondition",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${url}/getAllTermConditions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response?.data;
      } catch (error) {
        console.error("Get All Term & Condition Error:", error.message);
        alert("GetAll Term & Condition", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );


  export const DeleteTermCondition = createAsyncThunk(
    'deleteTermCondition',
    async (deleteId, { rejectWithValue , dispatch }) => {
      try {
        const response = await axios.delete(`${url}/deleteTermCondition/${deleteId}`,
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });
        dispatch(getAllTermCondition());
        return response?.data?.data;
      } catch (error) {
        console.error("DeleteReason Error:", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );
  

const termConditionSlice = createSlice({
  name: "termCondition",
  initialState: {
    termCondition: [],
    allTermCondition: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTermCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(createTermCondition.fulfilled, (state, action) => {
        // state.termCondition = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(createTermCondition.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Reason For Cancellation";
      })

      // all reason
      .addCase(getAllTermCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "Accepting Create Reason For Cancellation...";
      })
      .addCase(getAllTermCondition.fulfilled, (state, action) => {
        state.allTermCondition = action.payload;
        state.loading = false;
        state.message = "Create Reason For Cancellation SuccessFully";
      })
      .addCase(getAllTermCondition.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message =
          action.payload?.message || "Failed To Create Reason For Cancellation";
      });
  },
});

export default termConditionSlice.reducer;
