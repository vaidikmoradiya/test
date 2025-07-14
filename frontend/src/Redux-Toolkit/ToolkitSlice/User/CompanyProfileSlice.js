import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const GetAllCompanyProfile = createAsyncThunk(
  'getallcompanyprofile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/getCompanyProfile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetAllCompanyProfile Error:", error.message);
      if(error.status === 404){
        console.error("Get GetAllCompanyProfile Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetAllCompanyProfile " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);


const CompanyProfileSlice = createSlice({
  name: "companyprofile",
  initialState: {
    allCompanyProfileData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCompanyProfile.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetAllCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allCompanyProfileData = action.payload
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetAllCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
  },
});

export default CompanyProfileSlice.reducer;
