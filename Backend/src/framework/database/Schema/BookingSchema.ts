import {Schema} from "mongoose"


export const BookingSchema=new Schema({
    userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})