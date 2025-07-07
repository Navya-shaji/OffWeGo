import type { Vendor } from "./vendorInterface";

export interface VendorState {
  pendingVendors: Vendor[];
  approvedVendors: Vendor[];
  rejectedVendors: Vendor[];
}
