import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct, TMetalType, TMetalPurity } from '@/types/product.types';
import { ICartItem, ICoupon, IGiftCard } from '@/types/order.types';
import { toast } from 'sonner';

interface CartState {
  items: ICartItem[];
  coupon: ICoupon | null;
  giftCard: IGiftCard | null;
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  items: [],
  coupon: null,
  giftCard: null,
  isDrawerOpen: false,
};

const TAX_RATE = 0.18; // 18% GST
const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 500;

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: IProduct;
        variantId?: string;
        metalType?: TMetalType;
        metalPurity?: TMetalPurity;
        size?: string;
        quantity?: number;
      }>
    ) => {
      const { product, variantId, metalType = product.metalType, metalPurity = product.metalPurity, size, quantity = 1 } = action.payload;

      const existingIndex = state.items.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.variantId === variantId &&
          item.selectedMetal === metalType &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
        state.items[existingIndex].totalPrice = state.items[existingIndex].unitPrice * state.items[existingIndex].quantity;
        toast.success(`Updated quantity for ${product.name}`);
      } else {
        const unitPrice = product.salePrice || product.basePrice;
        state.items.push({
          product,
          variantId,
          quantity,
          selectedMetal: metalType,
          selectedPurity: metalPurity,
          selectedSize: size,
          unitPrice,
          totalPrice: unitPrice * quantity,
        });
        toast.success(`${product.name} added to cart`);
      }
      state.isDrawerOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; variantId?: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.product._id === action.payload.productId && item.variantId === action.payload.variantId)
      );
      toast.success('Item removed from cart');
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number; variantId?: string }>) => {
      if (action.payload.quantity < 1) return;
      const item = state.items.find((i) => i.product._id === action.payload.productId && i.variantId === action.payload.variantId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.unitPrice * action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.giftCard = null;
    },
    applyCoupon: (state, action: PayloadAction<ICoupon>) => {
      const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      if (subtotal < action.payload.minOrderAmount) {
        toast.error(`Minimum order amount is ₹${action.payload.minOrderAmount.toLocaleString()}`);
        return;
      }
      state.coupon = action.payload;
      toast.success(`Coupon "${action.payload.code}" applied!`);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      toast.success('Coupon removed');
    },
    applyGiftCard: (state, action: PayloadAction<IGiftCard>) => {
      state.giftCard = action.payload;
      toast.success(`Gift card applied! Balance: ₹${action.payload.balance.toLocaleString()}`);
    },
    removeGiftCard: (state) => {
      state.giftCard = null;
      toast.success('Gift card removed');
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  applyGiftCard,
  removeGiftCard,
  openDrawer,
  closeDrawer,
  toggleDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
