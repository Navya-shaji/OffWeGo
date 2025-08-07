import type { Vendor } from "@/interface/vendorInterface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type VendorAuthState = {
  isAuthenticated: boolean;
  vendor: Vendor | null;
  token: string | null;
};

const initialState: VendorAuthState = {
  isAuthenticated: false,
  vendor: null,
  token: null,
};

export const vendorAuthSlice = createSlice({
  name: "vendorAuth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ vendor: Vendor; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.vendor = null;
      state.token = null;
    },
    setVendorFromSession: (
      state,
      action: PayloadAction<{
        vendor: Vendor | null;
        token: string | null;
      }>
    ) => {
      if (action.payload.vendor && action.payload.token) {
        state.isAuthenticated = true;
        state.vendor = action.payload.vendor;
        state.token = action.payload.token;
      } else {
        state.isAuthenticated = false;
        state.vendor = null;
        state.token = null;
      }
    },
    updateVendorProfile: (state, action: PayloadAction<Partial<Vendor>>) => {
  if (state.vendor && action.payload) {
    state.vendor = { ...state.vendor, ...action.payload };
  }
},
    
  },
});

export const { login, logout, setVendorFromSession } = vendorAuthSlice.actions;

export default vendorAuthSlice.reducer;
