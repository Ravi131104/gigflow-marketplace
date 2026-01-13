import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = false;
      // Persist basic user info (not token) to survive refresh
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;