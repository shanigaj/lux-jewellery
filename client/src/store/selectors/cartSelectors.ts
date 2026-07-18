import { RootState } from '../index';

export const selectSubtotal = (state: RootState) => {
  return state.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
};

export const selectCouponDiscount = (state: RootState) => {
  const { coupon } = state.cart;
  if (!coupon) return 0;
  const subtotal = selectSubtotal(state);
  if (coupon.discountType === "percentage") {
    const discount = (subtotal * coupon.discountValue) / 100;
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  }
  return coupon.discountValue;
};

export const selectTax = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discount = selectCouponDiscount(state);
  return Math.round((subtotal - discount) * 0.18); // 18% GST
};

export const selectShipping = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  if (subtotal === 0) return 0;
  return subtotal >= 50000 ? 0 : 500; // Free above 50,000, else 500
};

export const selectGiftCardAmount = (state: RootState) => {
  const { giftCard } = state.cart;
  if (!giftCard) return 0;
  const remaining = selectSubtotal(state) - selectCouponDiscount(state) + selectTax(state) + selectShipping(state);
  return Math.min(giftCard.balance, remaining);
};

export const selectTotal = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discount = selectCouponDiscount(state);
  const tax = selectTax(state);
  const shipping = selectShipping(state);
  const giftCardAmt = selectGiftCardAmount(state);
  return Math.max(0, subtotal - discount + tax + shipping - giftCardAmt);
};

export const selectItemCount = (state: RootState) => {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
};
