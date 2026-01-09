export interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface ContactInfo {
  name: string;
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
  vendorId?: string;
}

export interface Booking {
  _id?: string;
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
}
