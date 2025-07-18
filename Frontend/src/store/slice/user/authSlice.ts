import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email: string;
  username: string;
  status: string;
  role: string;
  phone:string
};


type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    setUserFromSession: (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
      if (action.payload.user && action.payload.token) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
  },
});

export const { login, logout, setUserFromSession } = authSlice.actions;
export default authSlice.reducer;
