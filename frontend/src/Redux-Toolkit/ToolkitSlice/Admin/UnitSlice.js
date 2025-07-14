import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetUnitData = createAsyncThunk(
  'getunitdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllUnit`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get UnitData Error:", error.message);
      if(error.status === 404){
        console.error("Get UnitData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get UnitData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateUnitData = createAsyncThunk(
  'createunitdata',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/createUnit`,{
           unitName:values?.unitName,
           shortName:values?.shortName
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get CreateUnitData Error:", error.message);
      if(error.status === 404){
        console.error("Get CreateUnitData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert(error?.response?.data?.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditUnitData = createAsyncThunk(
  'editunitdata',
  async ({values , editData}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateUnit/${editData?._id}`,{
           unitName:values?.unitName,
           shortName:values?.shortName
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditUnitData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditUnitData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert(error?.response?.data?.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const EditUnitStatusData = createAsyncThunk(
  'editunitstatusdata',
  async ({status , id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/updateUnit/${id}`,{
           status:status
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get EditUnitStatusData Error:", error.message);
      if(error.status === 404){
        console.error("Get EditUnitStatusData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert(error?.response?.data?.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteUnitData = createAsyncThunk(
  'deleteunitdata',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/deleteUnitById/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Delete UnitData Error:", error.message);
      if(error.status === 404){
        console.error("Delete UnitData Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert(error?.response?.data?.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

const UnitSlice = createSlice({
  name: "unitslice",
  initialState: {
    getUnitData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetUnitData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get UnitData...";
      })
      .addCase(GetUnitData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.getUnitData = action.payload
        state.message = "Get UnitData SuccessFully";
      })
      .addCase(GetUnitData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get UnitData";
      })

      .addCase(CreateUnitData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get UnitData...";
      })
      .addCase(CreateUnitData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getUnitData = action.payload
        state.message = "Get UnitData SuccessFully";
      })
      .addCase(CreateUnitData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get UnitData";
      })

      .addCase(EditUnitData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditUnitData...";
      })
      .addCase(EditUnitData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getUnitData = action.payload
        state.message = "Get EditUnitData SuccessFully";
      })
      .addCase(EditUnitData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditUnitData";
      })

      .addCase(EditUnitStatusData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get EditUnitStatusData...";
      })
      .addCase(EditUnitStatusData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getUnitData = action.payload
        state.message = "Get EditUnitStatusData SuccessFully";
      })
      .addCase(EditUnitStatusData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get EditUnitStatusData";
      })

      .addCase(DeleteUnitData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get DeleteUnitData...";
      })
      .addCase(DeleteUnitData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.getUnitData = action.payload
        state.message = "Get DeleteUnitData SuccessFully";
      })
      .addCase(DeleteUnitData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get DeleteUnitData";
      })
  },
});

export default UnitSlice.reducer;
