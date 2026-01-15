export interface PackageWiseGroup {
  id: string;
  package_id: string;
  startDate: Date;
  endDate: Date;
  minPeople: number;
  MaxPeople: number;
  currentBookings: number;
  status: "open" | "cancelled" | "completed";
}
