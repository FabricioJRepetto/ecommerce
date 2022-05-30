import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducer/cartSlice.js";
import productsReducer from "../reducer/productsSlice.js";
import sessionReducer from "../reducer/sessionSlice.js";

export default configureStore({
  reducer: {
    cartReducer: cartReducer,
    productsReducer: productsReducer,
    sessionReducer: sessionReducer,
  },
});
