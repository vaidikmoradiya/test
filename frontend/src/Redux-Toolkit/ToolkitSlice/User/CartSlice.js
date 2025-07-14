import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:5000/api";
const token = localStorage.getItem("token")

export const Createcart = createAsyncThunk(
  'createcart',
  async (value, { rejectWithValue, getState }) => {
    try {
      const cartid = localStorage.getItem('UserId')
      
      // Get current cart items
      const currentCart = getState().cart.GetCartData;
      
      // Check if product already exists in cart
      const existingItem = currentCart.find(item => item.productId === value.id);
      
      if (existingItem) {
        // If product exists, update its quantity
        const response = await axios.put(`${url}/updateCart/${existingItem._id}`, 
          {
            qty: existingItem.qty + 1
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        return response?.data?.data;
      } else {
        // If product doesn't exist, add new item
        const response = await axios.post(`${url}/createCart`, 
          {
            productId: value.id,
            userId: cartid,
            qty: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        return response?.data?.data;
      }
    } catch (error) {
      console.error("Get Createcart Error:", error.message);
      if(error.status === 404){
        console.error("Get Createcart Error:", error?.message);
        let data = [];
        return data;
      }
      else{
        alert("Get Createcart " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const GetCartByuser = createAsyncThunk(
  'getcartbyuser',
  async (id, { rejectWithValue }) => {
    try {
     
      const cartid = localStorage.getItem('UserId')
      const response = await axios.get(`${url}/getCartByuser/${cartid}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      });
      console.log("response",response);
      
      return response?.data?.data;
    } catch (error) {
      console.error("Get GetCartByuser Error:", error.message);
      if(error.status === 404){
        console.error("Get GetCartByuser Error:", error?.message);
        let data = [];
         return data;
      }
      else{
        alert("Get GetCartByuser " , error.message)
      }
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const UpdateCartQuantity = createAsyncThunk(
  'updatecartquantity',
  async ({ itemId, qty }, { rejectWithValue  , dispatch}) => {
    try {
      const response = await axios.put(`${url}/updateCart/${itemId}`, 
        {
         
          qty: qty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
       dispatch(GetCartByuser())
      return response?.data?.data;
    } catch (error) {
      console.error("Update Cart Quantity Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error occurred" }
      );
    }
  }
);

export const DeleteCartItem = createAsyncThunk(
  'deletecartitem',
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${url}/deleteCart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      dispatch(GetCartByuser());
      return response?.data;
    } catch (error) {
      console.error("Delete Cart Item Error:", error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete cart item" }
      );
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    GetCartData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Createcart.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(Createcart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Get CateData SuccessFully";
      })
      .addCase(Createcart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
      .addCase(GetCartByuser.pending, (state) => {
        state.loading = true;
        state.message = "Accepting Get CateData...";
      })
      .addCase(GetCartByuser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.GetCartData = action.payload
        console.log(action.payload);
        
        state.message = "Get CateData SuccessFully";
      })
      .addCase(GetCartByuser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed To Get CateData";
      })
      .addCase(UpdateCartQuantity.pending, (state) => {
        state.loading = true;
        state.message = "Updating cart quantity...";
      })
      .addCase(UpdateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // const index = state.GetCartData.findIndex(item => item._id === action.payload._id);
        // if (index !== -1) {
        //   state.GetCartData[index] = action.payload;
        // }
        state.message = "Cart quantity updated successfully";
      })
      .addCase(UpdateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update cart quantity";
      })
      .addCase(DeleteCartItem.pending, (state) => {
        state.loading = true;
        state.message = "Deleting cart item...";
      })
      .addCase(DeleteCartItem.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Cart item deleted successfully";
      })
      .addCase(DeleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete cart item";
      });
  },
});

export default CartSlice.reducer;
