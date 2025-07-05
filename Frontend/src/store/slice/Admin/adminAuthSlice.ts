

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { adminLogin } from '@/services/admin/adminService'; 

type AdminUser = {
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  admin: AdminUser | null;
};


const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
};


export const loginAdmin = createAsyncThunk<
  AdminUser,                                 
  { email: string; password: string },       
  { rejectValue: string }>(
  '/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const admin = await adminLogin(email, password); 
      return admin;
    } catch (err) {
        console.log(err)
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);


const adminAuthSlice = createSlice({
  name: 'AdminAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('admin');
    },
    setAdminAuthfromstorage: (state) => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedAdmin = localStorage.getItem('admin');
      state.isAuthenticated = storedAuth === 'true';
      state.admin = storedAdmin ? JSON.parse(storedAdmin) : null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAdmin.fulfilled, (state, action: PayloadAction<AdminUser>) => {
      state.isAuthenticated = true;
      state.admin = action.payload;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('admin', JSON.stringify(action.payload));
    });
  },
});

export const { logout, setAdminAuthfromstorage } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
