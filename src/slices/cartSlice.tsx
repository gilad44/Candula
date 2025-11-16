import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, ProductVariant } from "../types/Product";

const getCartFromStorage = (): CartItem[] => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getCartFromStorage(),
  },
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity?: number;
        selectedVariant?: ProductVariant | null;
      }>
    ) => {
      const { productId, quantity = 1, selectedVariant } = action.payload;

      // Find existing item with same product and variant
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          JSON.stringify(item.selectedVariant) ===
            JSON.stringify(selectedVariant)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, selectedVariant });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>
    ) => {
      const { productId, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        if (quantity > 0) {
          existingItem.quantity = quantity;
        } else {
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
