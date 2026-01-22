import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import { ConnectDB } from "./framework/database/ConnectDB/connectDB";
import { UserRoute } from "./framework/routes/User/userRoute";
import { AdminRoute } from "./framework/routes/Admin/adminRoute";
import { VendorRoute } from "./framework/routes/Vendor/vendorRoute";

import { morganFileLogger } from "./framework/Logger/logger";
import { errorMiddleware } from "./adapters/flowControl/ErrorMiddleware";

import { SocketIoServer } from "./Io";


import "./framework/database/Models";
import { startAutoSettlementJob } from "./framework/Services/cronjob";

export class App {
  private app: Express;
  private database: ConnectDB;
  private server!: http.Server;
  private io!: SocketIOServer;

  constructor() {
    this.app = express();
    this.database = new ConnectDB();

    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [
          "https://offwego.online",
          "https://www.offwego.online",
          "http://localhost:5173",
          "http://localhost:4173",
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

    // Serve static files from the public directory (frontend build)
    const publicPath = path.resolve(process.cwd(), "public");
    console.log(`Serving static files from: ${publicPath}`);
    this.app.use(express.static(publicPath));

    // SPA fallback: serve index.html for all non-API routes
    this.app.get("*", (req, res) => {
      console.log(`SPA fallback for route: ${req.url}`);
      res.sendFile(path.join(publicPath, "index.html"), (err) => {
        if (err) {
          console.error(`Error sending index.html: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).send("Error loading application");
          }
        }
      });
    });
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 1212;

    try {
      await this.database.connect();
      console.log("Database connected successfully");


      startAutoSettlementJob();
      console.log("Auto Settlement Cron Started");


      this.server = http.createServer(this.app);


      this.io = new SocketIOServer(this.server, {
        cors: {
          origin: process.env.ALLOWED_ORIGINS?.split(',') || [
            "https://offwego.online",
            "https://www.offwego.online",
            "http://localhost:5173",
            "http://localhost:1212",
          ],
          credentials: true,
        },
      });

      // Setup socket event handlers
      new SocketIoServer(this.io);

      this.server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }
}

const appInstance = new App();
appInstance.listen();
