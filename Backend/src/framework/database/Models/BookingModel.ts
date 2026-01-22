import { Document, model, models, ObjectId } from "mongoose";
import { BookingSchema } from "../Schema/BookingSchema";

export interface IBookingDocument extends Document {
  userId: ObjectId;
  vendorId: ObjectId;
  contactInfo: {
    email: string;
    mobile: string;
    city: string;
    address: string;
  };
  adults: { name: string; age?: number; gender?: string }[];
  children: { name: string; age?: number; gender?: string }[];
  selectedPackage: {
    _id: ObjectId;
    packageName: string;
    price: number;
    duration: number;
  };
  selectedDate: Date;
  totalAmount: number;
  createdAt: Date;
}

export const BookingModel =
  models.Booking || model<IBookingDocument>("Booking", BookingSchema);
