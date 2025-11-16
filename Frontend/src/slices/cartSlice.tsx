import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, ProductVariant } from "../types/Product";

const getCartFromStorage = (userId?: string): CartItem[] => {
  const cartKey = userId ? `cart_${userId}` : "cart";
  const storedCart = localStorage.getItem(cartKey);
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (items: CartItem[], userId?: string) => {
  const cartKey = userId ? `cart_${userId}` : "cart";
  localStorage.setItem(cartKey, JSON.stringify(items));
};

const clearCartFromStorage = (userId?: string) => {
  const cartKey = userId ? `cart_${userId}` : "cart";
  localStorage.removeItem(cartKey);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [] as CartItem[], // Start with empty cart until user is set
    userId: null as string | null,
  },
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      const newUserId = action.payload;
      // Save current cart items for the previous user
      if (state.userId && state.items.length > 0) {
        saveCartToStorage(state.items, state.userId);
      }
      // Clear current items
      state.items = [];
      // Load cart items for the new user
      state.userId = newUserId;
      if (newUserId) {
        state.items = getCartFromStorage(newUserId);
      }
      // Clear generic cart storage when logging out
      if (!newUserId) {
        clearCartFromStorage(); // Clear generic cart
      }
    },
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
      saveCartToStorage(state.items, state.userId);
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
      saveCartToStorage(state.items, state.userId);
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
      saveCartToStorage(state.items, state.userId);
    },
    clearCart: (state) => {
      state.items = [];
      clearCartFromStorage(state.userId);
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
