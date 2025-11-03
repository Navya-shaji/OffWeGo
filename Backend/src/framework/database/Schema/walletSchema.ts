import { Schema } from "mongoose";

export const WalletSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ownerType: {
      type: String,
      enum: ["user", "vendor", "admin"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        refId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
