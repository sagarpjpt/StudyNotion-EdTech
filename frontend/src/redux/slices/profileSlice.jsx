import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = profileSlice.actions;
export default profileSlice.reducer;
