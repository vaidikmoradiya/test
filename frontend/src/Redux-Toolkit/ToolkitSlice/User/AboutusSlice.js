import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("login");

export const getallAboutUs = createAsyncThunk(
    "allFaq",
    async (_, { rejectWithValue }) => {
      // console.log("ghhhhh");
      
      try {
        const response = await axios.get(`${url}/getallAboutUs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("response",response.data); 
        
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

  export const createAboutus = createAsyncThunk(
    "createAbouts",
    async (values, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append('title', values?.title);
        formData.append('description', values?.description);
        // If image is a file or array of files, handle accordingly
        if (values.img) {
          if (Array.isArray(values.img)) {
            values.img.forEach(file => {
              formData.append('image', file);
            });
          } else {
            formData.append('image', values.img);
          }
        }
        const response = await axios.post(`${url}/createAboutUs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        return response?.data?.data;
      } catch (error) {
        console.error("Create createAboutus Error:", error.message);
        alert("Create createAboutus", error.message);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const EditAboutus = createAsyncThunk(
    "editAbouts",
    async ({values, id}, { rejectWithValue }) => {
      console.log("Edit values:", values);
      console.log("Edit ID:", id);

      const formData = new FormData();
      formData.append('title', values?.title);
      formData.append('description', values?.description);
      
      // Handle images properly - only send new files
      if (values.img && Array.isArray(values.img)) {
        values.img.forEach((item, index) => {
          if (item instanceof File) {
            // Only append new files
            formData.append('image', item);
          }
          // Don't append existing image paths - backend will handle them
        });
      }
      
      try { 
        const response = await axios.put(`${url}/updateAboutUs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Edit response:", response);
        return response?.data;
      } catch (error) {
        console.error("Edit Aboutus Error:", error.message);
        console.error("Error response:", error.response?.data);
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  export const DeleteAboutusData = createAsyncThunk(
    'deleteaboutusdata',
    async (deleteId, { rejectWithValue }) => {
      // console.log(values , id);
      try {
        const response = await axios.delete(`${url}/deleteAboutUs/${deleteId}`,
          {
          headers: {
              Authorization: `Bearer ${token}`,
          }
        });
        return response?.data?.data;
      } catch (error) {
        console.error("Get DeleteAboutusData Error:", error.message);
        if(error.status === 404){
          console.error("Get DeleteAboutusData Error:", error?.message);
          let data = [];
           return data;
        }
        else{
          alert("Get DeleteAboutusData " , error.message)
        }
        return rejectWithValue(
          error.response?.data || { message: "Unexpected error occurred" }
        );
      }
    }
  );

  const aboutslice = createSlice({
    name: "about",
    initialState: {
      about: [],
      allAbout: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // all reason
        .addCase(getallAboutUs.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.message = "Accepting Create Reason For Cancellation...";
        })
        .addCase(getallAboutUs.fulfilled, (state, action) => {
          state.allAbout = action.payload;
          state.loading = false;
          state.message = "Create Reason For Cancellation SuccessFully";
        })
        .addCase(getallAboutUs.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
          state.message =
            action.payload?.message || "Failed To Create Reason For Cancellation";
        })

        .addCase(createAboutus.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.message = "Accepting Create Reason For Cancellation...";
        })
        .addCase(createAboutus.fulfilled, (state, action) => {
          state.loading = false;
          state.message = "Create Reason For Cancellation SuccessFully";
        })
        .addCase(createAboutus.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
          state.message = action.payload?.message || "Failed To Create Reason For Cancellation";
        })

        .addCase(EditAboutus.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(EditAboutus.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "About Us Updated Successfully";
          // Update the specific item in allAbout array
          if (action.payload) {
            const index = state.allAbout.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
              state.allAbout[index] = action.payload;
            }
          }
        })
        .addCase(EditAboutus.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload;
          state.message = action.payload?.message || "Failed To Update About Us";
        })

        .addCase(DeleteAboutusData.pending, (state) => {
          state.loading = true;
          state.message = "Accepting Get CateData...";
        })
        .addCase(DeleteAboutusData.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = "Get CateData SuccessFully";
        })
        .addCase(DeleteAboutusData.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload?.message || "Failed To Get CateData";
        })
    },
  });
  
  export default aboutslice.reducer;