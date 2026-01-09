import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export class ConnectDB {
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(MONGO_URI, {
        // Ensure proper UTF-8 encoding support
        bufferCommands: false,
      });
      console.log(" MongoDB connected successfully.");
    } catch  {
      process.exit(1); 
    }
  }
}
