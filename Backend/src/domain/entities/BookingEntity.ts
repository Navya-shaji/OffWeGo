export interface Booking {
  id?: string;
  userId: string;
  packageId: string;
  selectedDate: Date;
  paymentStatus?: "pending" | "completed" | "failed";
  numberOfPeople?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
