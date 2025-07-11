import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { adminLogin } from "@/services/admin/adminService";
import type { AdminUser } from "@/Types/Admin/Login/Login type";
import type { AuthState } from "@/Types/Admin/Login/authstatetype";

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
};

export const loginAdmin = createAsyncThunk<
  AdminUser,
  { email: string; password: string },
  { rejectValue: string }>("adminAuth/login", async ({ email, password }, thunkAPI) => {
  try {
    const admin = await adminLogin(email, password);
    return admin;
  } catch (err) {
    console.log(err);
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
    },
    setAdminFromSession: (
      state,
      action: PayloadAction<{ admin: AdminUser | null }>
    ) => {
      if (action.payload.admin) {
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
      } else {
        state.isAuthenticated = false;
        state.admin = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginAdmin.fulfilled,
      (state, action: PayloadAction<AdminUser>) => {
        state.isAuthenticated = true;
        state.admin = action.payload;
      }
    );
  },
});

export const { logout, setAdminFromSession } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
