import { Schema } from "mongoose";

export const TravelerSchema = new Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
});

export const ContactInfoSchema = new Schema({
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
});

export const SelectedPackageSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  packageName: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  
});

export const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: String, required: true, unique: true },
  contactInfo: { type: ContactInfoSchema, required: true },
  adults: { type: [TravelerSchema], default: [] },
  children: { type: [TravelerSchema], default: [] },
  selectedPackage: { type: Schema.Types.ObjectId, ref: "Package" },
  selectedDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: "pending" },
  paymentIntentId: { type: String },
  bookingStatus:{type:String,default:"upcoming"},
  settlementDone: { type: Boolean, default: false },
});
