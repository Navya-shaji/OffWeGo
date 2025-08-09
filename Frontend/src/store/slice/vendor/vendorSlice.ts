import type { Vendor } from "@/interface/vendorInterface";
import type { VendorState } from "@/interface/vendorStateInterface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const initialState: VendorState = {
  pendingVendors: [],
  approvedVendors: [],
  rejectedVendors: [],
  currentVendor: null,
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setPendingVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.pendingVendors = action.payload || [];
    },
    setApprovedVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.approvedVendors = action.payload || [];
    },
    setRejectedVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.rejectedVendors = action.payload || [];
    },
    clearAllVendors: (state) => {
      state.pendingVendors = [];
      state.approvedVendors = [];
      state.rejectedVendors = [];
    },
  
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },
  },
});


export const {
  setPendingVendors,
  setApprovedVendors,
  setRejectedVendors,
  clearAllVendors,
  setCurrentVendor,
} = vendorSlice.actions;


export default vendorSlice.reducer;
