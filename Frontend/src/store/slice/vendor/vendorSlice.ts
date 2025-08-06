import type { Vendor } from "@/interface/vendorInterface";
import type { VendorState } from "@/interface/vendorStateInterface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Initial state
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
    updateVendor: (
      state,
      action: PayloadAction<{ id: string; updatedData: Partial<Vendor> }>
    ) => {
      const { id, updatedData } = action.payload;

      const updateVendorList = (list: Vendor[]) =>
        list.map((vendor) =>
          vendor._id === id ? { ...vendor, ...updatedData } : vendor
        );

      state.pendingVendors = updateVendorList(state.pendingVendors);
      state.approvedVendors = updateVendorList(state.approvedVendors);
      state.rejectedVendors = updateVendorList(state.rejectedVendors);
    },
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },


  },
});

// Export actions
export const {
  setPendingVendors,
  setApprovedVendors,
  setRejectedVendors,
  clearAllVendors,
  updateVendor,
  setCurrentVendor,
} = vendorSlice.actions;

// Export reducer
export default vendorSlice.reducer;
