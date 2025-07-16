import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { adminLogin } from "@/services/admin/adminService";
import type { AdminUser } from "@/Types/Admin/Login/Login type";

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  token: null,
};


export const loginAdmin = createAsyncThunk<
  { admin: AdminUser; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("adminAuth/login", async ({ email, password }, thunkAPI) => {
  try {
    const response = await adminLogin(email, password);
    return response;
  } catch (err) {
    console.error(err);
    return thunkAPI.rejectWithValue("Login failed");
  }
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
    },
    setAdminFromSession: (
      state,
      action: PayloadAction<{ admin: AdminUser | null; token?: string | null }>
    ) => {
      if (action.payload.admin) {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token ?? null;
      } else {
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginAdmin.fulfilled,
      (
        state,
        action: PayloadAction<{ admin: AdminUser; token: string }>
      ) => {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      }
    );
    builder.addCase(loginAdmin.rejected, (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
    });
  },
});

export const { logout, setAdminFromSession } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
