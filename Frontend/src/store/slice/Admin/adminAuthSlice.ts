import { createSlice, createAsyncThunk,type  PayloadAction } from "@reduxjs/toolkit";
import { adminLogin } from "@/services/admin/adminService";
import type { AdminUser } from "@/Types/Admin/Login/Login type";

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
}


const storedToken = localStorage.getItem("adminToken");
const storedAdmin = localStorage.getItem("adminData");

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  token: storedToken,
};

export const loginAdmin = createAsyncThunk<
  { admin: AdminUser; accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("adminAuth/login", async ({ email, password }, thunkAPI) => {
  try {
    const response = await adminLogin(email, password);

    localStorage.setItem("adminToken", response.accessToken);
    localStorage.setItem("adminData", JSON.stringify(response.admin));

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

      
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    },
    setAdminFromSession: (
      state,
      action: PayloadAction<{ admin: AdminUser | null; token?: string | null }>
    ) => {
      if (action.payload.admin && action.payload.token) {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;

        
        localStorage.setItem("adminToken", action.payload.token);
        localStorage.setItem("adminData", JSON.stringify(action.payload.admin));
      } else {
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginAdmin.fulfilled,
      (
        state,
        action: PayloadAction<{ admin: AdminUser; accessToken: string }>
      ) => {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.accessToken;
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
