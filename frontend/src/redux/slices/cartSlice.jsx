import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [], // all cart items (array)
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0, // item count
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //  Set total items directly
    setTotalItems(state, action) {
      state.totalItems = action.payload;
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    //  Add item to cart
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.cartItems.find((el) => el._id === item._id);

      if (existingItem) {
        toast.error("Item already in cart");
      } else {
        state.cartItems.push(item);
        state.totalItems += 1;
        toast.success("Item added to cart");
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    //  Remove item from cart
    removeFromCart(state, action) {
      const id = action.payload;
      const itemIndex = state.cartItems.findIndex((el) => el._id === id);

      if (itemIndex >= 0) {
        state.cartItems.splice(itemIndex, 1);
        state.totalItems -= 1;
        toast.success("Item removed from cart");
      } else {
        toast.error("Item not found in cart");
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    //  Reset cart (e.g., after purchase or logout)
    resetCart(state) {
      state.cartItems = [];
      state.totalItems = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalItems");
      toast.success("Cart cleared");
    },
  },
});

export const { setTotalItems, addToCart, removeFromCart, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
