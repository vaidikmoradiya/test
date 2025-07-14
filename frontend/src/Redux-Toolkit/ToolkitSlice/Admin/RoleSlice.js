import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login")

export const GetRoleData = createAsyncThunk(
  'getroledata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getAllRole`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get RoleData Error:", error.message);
      if(error.status === 404){
        console.error("Get RoleData Error:", error?.message);
        let data =[];
         return data;
      }
      else{
        alert("Get RoleData " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const CreateRole = createAsyncThunk(
    'createrole',
    async (values, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${url}/createRole`, {
            roleName:values?.roleName
        }, 
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          
        });
        return response?.data?.data;
      } catch (error) {
        console.error("CreateRole Error:", error.message);
        alert("CreateRole", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const EditRole = createAsyncThunk(
    'editrole',
    async ({values , editData}, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${url}/updateRole/${editData?._id}`, {
            roleName:values?.roleName
        }, 
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });
        return response?.data?.data;
      } catch (error) {
        console.error("EditRole Error:", error.message);
        alert("EditRole", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

export const DeleteRole = createAsyncThunk(
    'deleterole',
    async (deleteId, { rejectWithValue , dispatch }) => {
      try {
        const response = await axios.delete(`${url}/deleteRoleById/${deleteId}`,
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });
        dispatch(GetRoleData())
        return response?.data?.data;
      } catch (error) {
        console.error("DeleteRole Error:", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
);

const RoleSlice = createSlice({
  name: "role",
  initialState: {
    roleData:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetRoleData.pending, (state) => {
        state.loading = true;
        state.message = "Accepting GetRoleData...";
      })
      .addCase(GetRoleData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.roleData = action.payload
        state.message = "GetRoleData SuccessFully";
      })
      .addCase(GetRoleData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To GetRoleData";
      })

      .addCase(CreateRole.pending, (state) => {
        state.loading = true;
        state.message = "Accepting CreateRole...";
      })
      .addCase(CreateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.roleData = action.payload
        state.message = "CreateRole SuccessFully";
      })
      .addCase(CreateRole.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To CreateRole";
      })

      .addCase(EditRole.pending, (state) => {
        state.loading = true;
        state.message = "Accepting EditRole...";
      })
      .addCase(EditRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.roleData = action.payload
        state.message = "EditRole SuccessFully";
      })
      .addCase(EditRole.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To EditRole";
      })

      .addCase(DeleteRole.pending, (state) => {
        state.loading = true;
        state.message = "Accepting DeleteRole...";
      })
      .addCase(DeleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.roleData = action.payload
        state.message = "DeleteRole SuccessFully";
      })
      .addCase(DeleteRole.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To DeleteRole";
      })
  },
});

export default RoleSlice.reducer;
