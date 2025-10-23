import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { adminLogin } from "@/services/admin/adminService";
import type { AdminUser } from "@/Types/Admin/Login/Login type";

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
}

const storedToken = localStorage.getItem("adminToken");
const storedRefreshToken = localStorage.getItem("adminRefreshToken");
const storedAdmin = localStorage.getItem("admin");

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  token: storedToken,
  refreshToken: storedRefreshToken,
};

export const loginAdmin = createAsyncThunk<
  { admin: AdminUser; accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("adminAuth/login", async ({ email, password }, thunkAPI) => {
  try {
    const response = await adminLogin(email, password);

    localStorage.setItem("adminToken", response.accessToken);
    localStorage.setItem("adminRefreshToken", response.refreshToken);
    localStorage.setItem("adminData", JSON.stringify(response.admin));

    return response;
  } catch (err) {
    console.log(err)
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
      state.refreshToken = null;

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminData");
    },
    setAdminFromSession: (
      state,
      action: PayloadAction<{ admin: AdminUser | null; token?: string | null; refreshToken?: string | null }>
    ) => {
      if (action.payload.admin && action.payload.token) {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken ?? null;

        localStorage.setItem("adminToken", action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
        }
        localStorage.setItem("adminData", JSON.stringify(action.payload.admin));
      } else {
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
        state.refreshToken = null;

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminData");
      }
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginAdmin.fulfilled,
      (
        state,
        action: PayloadAction<{ admin: AdminUser; accessToken: string; refreshToken: string }>
      ) => {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      }
    );
    builder.addCase(loginAdmin.rejected, (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.refreshToken = null;
    });
  },
});

export const { logout, setAdminFromSession, setToken } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
