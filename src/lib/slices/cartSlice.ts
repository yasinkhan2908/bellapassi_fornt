// store/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch, RootState } from "../store";  

import { 
  CartState, 
  CartItem, 
  AddToCartPayload
} from '../../types/cart';

// Initial state with type
const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

// Async thunks with proper typing
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: AddToCartPayload, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add-to-cart`, {
                            product_id: payload.product_id,
                            category_id: payload.category_id,
                            size: payload.size,
                            quantity: payload.quantity,
                            session_id: payload.session_id,
                            Authorization: `Bearer ${payload.token}`,
                        });
        console.log(response);
        localStorage.setItem('cart_items',response.data.totalCount);  
        // let items = response.data; 
        //toast.success('Product successfully add on cart!');
        return response.data;
        
    } catch (error: any) {
        //console.log(error.response?.data);
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


// Define the payload type
interface FetchCartPayload {
  session_id: string;
  token: string;
}

// Define the response type
interface FetchCartResponse {
  cartItems: any[]; // Replace 'any' with your actual cart item type
  total: number;
}

// Update fetchCart to accept payload
export const fetchCart = createAsyncThunk<
  FetchCartResponse, // Return type
  FetchCartPayload,  // Payload type
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('cart/fetchCart', async (payload, { rejectWithValue }) => {
  try {
    console.log("payload session_id = ",payload.session_id);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cart-data`, {
      headers: {
        Authorization: `Bearer ${payload.token}`,
        'session_id': payload.session_id,
        'Content-Type': 'application/json',
      },
      params: {
        session_id: payload.session_id
      }
    });
    console.log("fetch response",response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch cart'
    );
  }
});



interface UpdateCartPayload {
  cartId: number;
  quantity: number;
}


interface RemoveCartPayload {
  cartId: number;
  session_id: string;
  token: string;
}

interface UpdateCartResponse {
  cartItem: CartItem;
  message: string;
}

// Thunk - keep it simple without complex generics for now
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (payload: UpdateCartPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update-cart-data/${payload.cartId}`, {
        quantity: Number(payload.quantity)
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (payload: RemoveCartPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/remove-cart-data/${payload.cartId}`, {
        session_id: payload.session_id,
        Authorization: `Bearer ${payload.token}`,
      });
      console.log("totalCount : ",response.data.totalCount);
      localStorage.setItem('cart_items',response.data.totalCount);  
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cartItems;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const newItem = action.payload.cartItem;

        const existing = state.items.find(
            item => item.product_id === newItem.product_id
        );

        if (existing) {
            existing.quantity = newItem.quantity;
        } else {
            state.items.push(newItem);
        }

        state.total = state.items.reduce((sum, item) => {
          const qty = Number(item?.quantity ?? 0);
          const price = Number(item?.product?.price ?? 0);
          return sum + qty * price;
      }, 0);
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload.cartItem;
        const index = state.items.findIndex(
          item => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        
        state.total = state.items.reduce((total, item) => {
          //console.log("item product : ",total);
          return total + (Number(item.quantity) * Number(item.product.price));
        }, 0);
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = state.items.reduce((total, item) => {
          return total + (Number(item.quantity) * Number(item.product.price));
        }, 0);
      });
  }
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((t, item) => t + item.quantity, 0);
