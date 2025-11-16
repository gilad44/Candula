import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../slices/cartSlice";
import userSlice from "../slices/userSlice";

const store = configureStore({
  reducer: {
    userSlice,
    cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; // this is the store of the redux
