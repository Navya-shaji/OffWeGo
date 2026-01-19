import {
  ContactInfo,
  PackageInfo,
  Traveler,
} from "../../entities/BookingEntity";

export interface TravelerDto {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}
export interface ContactInfoDto {
  email: string;
  mobile: string;
  city: string;
  address: string;
}
export interface PackageDto {
  _id: string;
  packageName: string;
  price: number;
  description?: string;
  duration?: number;
  packageImage?: string;
}

export interface BookingDataDto {
  _id: string;
  bookingId: string;
  userId: string;
  vendorId?: string;
  contactInfo: ContactInfo;
  adults: Traveler[];
  children: Traveler[];
  selectedPackage: PackageInfo;
  selectedDate: Date;
  totalAmount: number;
  paymentIntentId?: string;
  paymentStatus?: "pending" | "succeeded" | "failed";
  payment_id?: string;
  bookingStatus: "upcoming" | "completed" | "cancelled";
  settlementDone: boolean;
  createdAt?: Date;
}
