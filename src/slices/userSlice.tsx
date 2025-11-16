import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, User, UserPreferences } from "../types/User";

export type TUser = User;

const getUserFromStorage = (): TUser | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const initialState = {
  user: getUserFromStorage() as TUser | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, data) => {
      state.user = data.payload;
      const savedFavorites = localStorage.getItem(
        `favorites_${data.payload.email}`
      );
      if (savedFavorites) {
        state.user.favorites = JSON.parse(savedFavorites);
      } else {
        state.user.favorites = []; // Initialize empty if no saved favorites
      }

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      if (state.user && state.user.favorites) {
        localStorage.setItem(
          `favorites_${state.user.email}`,
          JSON.stringify(state.user.favorites)
        );
      }
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUser: (state, data) => {
      if (state.user) {
        state.user = { ...state.user, ...data.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          updatedAt: new Date(),
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updatePreferences: (state, action: PayloadAction<UserPreferences>) => {
      if (state.user) {
        state.user.preferences = action.payload;
        state.user.updatedAt = new Date();
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      if (state.user) {
        if (!state.user.orders) {
          state.user.orders = [];
        }
        state.user.orders.unshift(action.payload); // Add to beginning of array
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.user) {
        if (!state.user.favorites) {
          state.user.favorites = [];
        }
        const productId = action.payload;
        const index = state.user.favorites.indexOf(productId);
        if (index > -1) {
          state.user.favorites.splice(index, 1);
        } else {
          state.user.favorites.push(productId);
        }
        localStorage.setItem(
          `favorites_${state.user.email}`,
          JSON.stringify(state.user.favorites)
        );
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
