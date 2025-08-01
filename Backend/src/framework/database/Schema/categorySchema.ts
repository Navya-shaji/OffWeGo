import { Schema } from "mongoose";

export const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  type: {
    main: {
      type: String,
      required: true,
    },
    sub: {
      type: [String],
      required: true,
    },
  },
});
