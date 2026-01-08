import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export class ConnectDB {
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(MONGO_URI);
      // eslint-disable-next-line no-console
      console.log(" MongoDB connected successfully.");
    } catch  {
      process.exit(1); 
    }
  }
}
