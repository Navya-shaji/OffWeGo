import { ContactInfo, PackageInfo, Traveler } from "../../entities/BookingEntity";


export interface TravelerDto {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface PackageDto {
  _id: string;
  packageName: string;
  price: number;
  description?: string;
  duration?: number;
}

export interface ContactInfoDto {
  email: string;
  mobile: string;
  city: string;
  address: string;
}


interface BookData {
   userId: string;
  contactInfo: ContactInfo;
  adults: Traveler[];
  children: Traveler[];
  selectedPackage: PackageInfo;
  selectedDate: Date;
  totalAmount: number;
  paymentIntentId?: string;
  paymentStatus: "pending" | "succeeded" | "failed";
}
export interface CreateBookingDto {
 data :BookData,
 payment_id:string
 paymentStatus:"pending" | "succeeded" | "failed";
}

