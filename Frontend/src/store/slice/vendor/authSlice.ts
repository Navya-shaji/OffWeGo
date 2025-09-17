import type { Vendor } from "@/interface/vendorInterface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type VendorAuthState = {
  isAuthenticated: boolean;
  vendor: Vendor | null;
  token: string | null;
  refreshToken: string | null; 
};

const initialState: VendorAuthState = {
  isAuthenticated: false,
  vendor: null,
  token: null,
  refreshToken: null, 
};

export const vendorAuthSlice = createSlice({
  name: "vendorAuth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ vendor: Vendor; token: string; refreshToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken; 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.vendor = null;
      state.token = null;
      state.refreshToken = null; 
    },
    setToken:(state,action:PayloadAction<{token:string}>)=>{
      state.token=action.payload.token
    },
    setVendorFromSession: (
      state,
      action: PayloadAction<{ vendor: Vendor | null; token: string | null; refreshToken?: string | null }>
    ) => {
      if (action.payload.vendor && action.payload.token) {
        state.isAuthenticated = true;
        state.vendor = action.payload.vendor;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken ?? null; 
      } else {
        state.isAuthenticated = false;
        state.vendor = null;
        state.token = null;
        state.refreshToken = null;
      }
    },
    updateVendorProfile: (state, action: PayloadAction<Partial<Vendor>>) => {
      if (state.vendor && action.payload) {
        state.vendor = { ...state.vendor, ...action.payload };
      }
    },
  },
});

export const { login, logout, setVendorFromSession, updateVendorProfile } = vendorAuthSlice.actions;
export default vendorAuthSlice.reducer;
