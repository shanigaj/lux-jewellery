import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '@/types/product.types';
import { toast } from 'sonner';

interface ProductState {
  wishlist: IProduct[];
  compareList: IProduct[];
}

const initialState: ProductState = {
  wishlist: [],
  compareList: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProduct>) => {
      if (!state.wishlist.find((p) => p._id === action.payload._id)) {
        state.wishlist.push(action.payload);
        toast.success(`Added ${action.payload.name} to wishlist`);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter((p) => p._id !== action.payload);
    },
    toggleWishlist: (state, action: PayloadAction<IProduct>) => {
      const exists = state.wishlist.find((p) => p._id === action.payload._id);
      if (exists) {
        state.wishlist = state.wishlist.filter((p) => p._id !== action.payload._id);
      } else {
        state.wishlist.push(action.payload);
        toast.success(`Added ${action.payload.name} to wishlist`);
      }
    },
    addToCompare: (state, action: PayloadAction<IProduct>) => {
      if (state.compareList.length >= 4) {
        toast.error('You can only compare up to 4 items at a time.');
        return;
      }
      if (!state.compareList.find((p) => p._id === action.payload._id)) {
        state.compareList.push(action.payload);
        toast.success(`Added ${action.payload.name} to compare`);
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.compareList = state.compareList.filter((p) => p._id !== action.payload);
    },
    toggleCompare: (state, action: PayloadAction<IProduct>) => {
      const exists = state.compareList.find((p) => p._id === action.payload._id);
      if (exists) {
        state.compareList = state.compareList.filter((p) => p._id !== action.payload._id);
      } else {
        if (state.compareList.length >= 4) {
          toast.error('You can only compare up to 4 items at a time.');
          return;
        }
        state.compareList.push(action.payload);
        toast.success(`Added ${action.payload.name} to compare`);
      }
    },
    clearCompare: (state) => {
      state.compareList = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  addToCompare,
  removeFromCompare,
  toggleCompare,
  clearCompare,
} = productSlice.actions;

export default productSlice.reducer;
