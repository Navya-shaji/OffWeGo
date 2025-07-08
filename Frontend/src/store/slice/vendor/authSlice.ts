
import type { Vendor } from "@/interface/vendorInterface";
import { createSlice, type PayloadAction} from "@reduxjs/toolkit";



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
    vendorLogin: (
      state,
      action: PayloadAction<{ vendor: Vendor; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.vendor = action.payload.vendor;
      state.token = action.payload.token;

      localStorage.setItem("vendor-auth", "true");
      localStorage.setItem("vendor", JSON.stringify(action.payload.vendor));
      localStorage.setItem("vendor-token", action.payload.token);
    },
    vendorLogout: (state) => {
      state.isAuthenticated = false;
      state.vendor = null;
      state.token = null;

      localStorage.removeItem("vendor-auth");
      localStorage.removeItem("vendor");
      localStorage.removeItem("vendor-token");
    },
    setVendorAuthFromStorage: (state) => {
      const storedAuth = localStorage.getItem("vendor-auth");
      const storedVendor = localStorage.getItem("vendor");
      const storedToken = localStorage.getItem("vendor-token");

      state.isAuthenticated = storedAuth === "true";
      state.vendor = storedVendor ? JSON.parse(storedVendor) : null;
      state.token = storedToken ?? null;
    },
  },
});

export const {
  vendorLogin,
  vendorLogout,
  setVendorAuthFromStorage,
} = vendorAuthSlice.actions;

export default vendorAuthSlice.reducer;
