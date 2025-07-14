import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = "http://localhost:5000/api";

const API_URL = 'http://localhost:5000/api'; // Adjust this to match your backend URL
const token = localStorage.getItem('token')

export const createContact = createAsyncThunk(
    'contact/create',
    async (contactData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/createContact`, contactData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const GetContactusData = createAsyncThunk(
    'getcontactusdata',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${url}/getAllContact`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data;
      } catch (error) {
        console.error("Get GetContactusData Error:", error.message);
        if(error.status === 404){
          console.error("Get GetContactusData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get GetContactusData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const GetSingleContactUsData = createAsyncThunk(
    'getsinglecontactusdata',
    async (editid, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${url}/getContactById/${editid}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get GetSingleContactUsData Error:", error.message);
        if(error.status === 404){
          console.error("Get GetSingleContactUsData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get GetSingleContactUsData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const DeleteContactUsData = createAsyncThunk(
    'deletecontactusdata',
    async (deleteId, { rejectWithValue }) => {
      // console.log(values , id);
      try {
        const response = await axios.delete(`${url}/deleteContact/${deleteId}`,
          {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data;
      } catch (error) {
        console.error("Get DeleteContactUsData Error:", error.message);
        if(error.status === 404){
          console.error("Get DeleteContactUsData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get DeleteContactUsData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        getContactData:[],
        getSingleContactData:[],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContact.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            .addCase(GetContactusData.pending, (state) => {
                state.loading = true;
                state.message = "Accepting Get MainCateData...";
            })
            .addCase(GetContactusData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.getContactData = action.payload
                state.message = "Get MainCateData SuccessFully";
            })
            .addCase(GetContactusData.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || "Failed To Get MainCateData";
            })

            .addCase(GetSingleContactUsData.pending, (state) => {
                state.loading = true;
                state.message = "Accepting Get MainCateData...";
            })
            .addCase(GetSingleContactUsData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.getSingleContactData = action.payload
                state.message = "Get MainCateData SuccessFully";
            })
            .addCase(GetSingleContactUsData.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || "Failed To Get MainCateData";
            })

            .addCase(DeleteContactUsData.pending, (state) => {
                state.loading = true;
                state.message = "Accepting Get CateData...";
            })
            .addCase(DeleteContactUsData.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Get CateData SuccessFully";
            })
            .addCase(DeleteContactUsData.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || "Failed To Get CateData";
            })
    },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
