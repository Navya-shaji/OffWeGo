export interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface ContactInfo {
  email: string;
  mobile: string;
  city: string;
  address: string;
}

export interface PackageInfo {
  _id: string;
  packageName: string;
  price: number;
  description?: string;
  duration?: number;
}

export interface Booking {

  vendorId: string;
  startDate: string | number | Date;
  packageId?: string;
  _id?: string;
  bookingId: string;
  userId: string;
  contactInfo: ContactInfo;
  adults: Traveler[];
  children: Traveler[];
  selectedPackage: PackageInfo;
  selectedDate: Date;
  totalAmount: number;
  paymentIntentId?: string;
  paymentStatus: "pending" | "succeeded" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
  bookingStatus: "upcoming" | "completed" | "cancelled";
  settlementDone: boolean

}
