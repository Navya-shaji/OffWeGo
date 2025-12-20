import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  phone: string;
  imageUrl?: string;
  location?: string;
  isGoogleUser?: boolean;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    setUserFromSession: (
      state,
      action: PayloadAction<{ user: User | null; token: string | null; refreshToken: string | null }>
    ) => {
      if (action.payload.user && action.payload.token) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {

      state.token = action.payload.token;
    },
  },
});

export const { login, logout, setUserFromSession, updateUserProfile, setToken } =
  authSlice.actions;
export default authSlice.reducer;
