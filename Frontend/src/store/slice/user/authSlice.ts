import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuthenticated: boolean;
  user: { username?: string; email?: string; imageUrl?: string } | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: { username: string; email: string; imageUrl?: string };
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },
    setAuthFromStorage: (state) => {
      const storedAuth = localStorage.getItem("isAuthenticated");
      const storedUser = localStorage.getItem("user");
      state.isAuthenticated = storedAuth === "true";
      state.user = storedUser ? JSON.parse(storedUser) : null;
    },
  },
});

export const { login, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
