import type { Vendor } from "./vendorInterface";

export interface VendorListProps {
  title: string;
  vendors: Vendor[];
  bgColor?: string;
  showActions?: boolean;
  onAction?: (vendorId: string, status: "approved" | "rejected") => void;

 
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
}