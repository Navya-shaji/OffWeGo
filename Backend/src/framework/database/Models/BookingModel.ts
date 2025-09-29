import { Document, model, models, ObjectId } from "mongoose";
import { Booking } from "../../../domain/entities/BookingEntity";
import { BookingSchema } from "../Schema/BookingSchema";

export interface IBookingModel extends Omit<Booking, "id">, Document {
  _id: ObjectId;
}

export const BookingModel =
  models.package || model<IBookingModel>("package", BookingSchema);
