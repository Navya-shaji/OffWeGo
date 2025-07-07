import type { Vendor } from "@/interface/vendorInterface";
import type { VendorState } from "@/interface/vendorStateInterface";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


const initialState: VendorState = {
  pendingVendors: [],
  approvedVendors: [],
  rejectedVendors: [],
};
export const vendorSlice = createSlice({
 name: 'vendorSlice',
  initialState,
  reducers: {
    setPendingVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.pendingVendors = action.payload;
    },
    setApprovedVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.approvedVendors = action.payload;
    },
    setRejectedVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.rejectedVendors = action.payload;
    },
    clearAllVendors: (state) => {
      state.pendingVendors = [];
      state.approvedVendors = [];
      state.rejectedVendors = [];
    },
  },
});

export const {
  setPendingVendors,
  setApprovedVendors,
  setRejectedVendors,
  clearAllVendors,
} = vendorSlice.actions;



export default vendorSlice.reducer;
