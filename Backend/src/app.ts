import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import { ConnectDB } from "./framework/database/ConnectDB/connectDB";
import { UserRoute } from "./framework/routes/User/userRoute";
import { AdminRoute } from "./framework/routes/Admin/adminRoute";
import { VendorRoute } from "./framework/routes/Vendor/vendorRoute";
import { CommonRoute } from "./framework/routes/Auth/AuthRoutes";

import { morganFileLogger } from "./framework/Logger/logger";
import { errorMiddleware } from "./adapters/flowControl/ErrorMiddleware";
import { ChatRoutes } from "./framework/routes/Chat/ChatRoutes";

export class App {
  private app: Express;
  private database: ConnectDB;
  private server!: http.Server;
  private io!: SocketIOServer;

  constructor() {
    dotenv.config();
    this.app = express();
    this.database = new ConnectDB();

    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "http://localhost:4173",
          "http://localhost:1212",
          "https://jvm9v112-5173.inc1.devtunnels.ms",
        ],
        credentials: true,
      })
    );

    this.setMiddlewares();
    this.setRoutes();
    this.app.use(errorMiddleware);
  }

  private setMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(morganFileLogger);
  }

  private setRoutes(): void {
    this.app.use("/api", new UserRoute().userRouter);
    this.app.use("/api/admin", new AdminRoute().adminRouter);
    this.app.use("/api/vendor", new VendorRoute().vendorRouter);
    this.app.use("/api", new CommonRoute().commonRouter);
    this.app.use("/api/chat", new ChatRoutes().router);
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 1212;

    try {
      await this.database.connect();

      this.server = http.createServer(this.app);

      this.io = new SocketIOServer(this.server, {
        cors: {
          origin: [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://localhost:1212",
            "https://jvm9v112-5173.inc1.devtunnels.ms",
          ],
          credentials: true,
        },
      });

      // -------------------------------------------
      //          🔥 CLEAN SOCKET.IO LOGIC
      // -------------------------------------------
      this.io.on("connection", (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        // Join a chat room
        socket.on("joinChat", (chatId: string) => {
          socket.join(chatId);
        });

        // Send + Broadcast message to room
        socket.on("sendMessage", (data) => {
          if (!data.chatId) return;
          this.io.to(data.chatId).emit("receiveMessage", data);
        });

        socket.on("disconnect", () => {
          console.log("🔴 Socket disconnected:", socket.id);
        });
      });

      // -------------------------------------------

      this.server.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
      });
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    }
  }
}

const appInstance = new App();
appInstance.listen();
