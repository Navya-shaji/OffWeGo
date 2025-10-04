import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from 'cookie-parser'

import { ConnectDB } from "./framework/database/ConnectDB/connectDB";
import { UserRoute } from "./framework/routes/User/userRoute";
import { AdminRoute } from "./framework/routes/Admin/adminRoute";
import { VendorRoute } from "./framework/routes/Vendor/vendorRoute";
import { CommonRoute } from "./framework/routes/Auth/AuthRoutes"; 
import {  morganFileLogger } from "./framework/Logger/logger";
import { errorMiddleware } from "./adapters/flowControl/ErrorMiddleware";

export class App {
  private app: Express;
  private database: ConnectDB;
  private server!: http.Server;

  constructor() {
    dotenv.config();
    this.app = express();
    this.database = new ConnectDB();

    this.app.use(
      cors({
        origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:1212'],
        credentials: true,
      })
    );

    this.setMiddlewares();
    this.setUserRoutes();
    this.setAdminRoutes();
    this.setVendorRoutes();
    this.setCommonRoutes(); 
    this.app.use(errorMiddleware)   
  }

private setMiddlewares(): void {
  this.app.use(express.json());
  this.app.use(cookieParser());

  this.app.use(morganFileLogger);  
  
  
}

  private setUserRoutes(): void {
    this.app.use("/api", new UserRoute().userRouter);
  }

  private setAdminRoutes(): void {
    this.app.use("/api/admin", new AdminRoute().adminRouter);
  }

  private setVendorRoutes(): void {
    this.app.use("/api/vendor", new VendorRoute().vendorRouter);
  }

  private setCommonRoutes(): void {
    this.app.use("/api", new CommonRoute().commonRouter); 
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 1212;

    try {
      await this.database.connect();
      this.server = this.app.listen(port, () => {
        console.log(` Server is running on port ${port}`);
      });
    } catch (error) {
      console.error(" Failed to connect to DB:", error);
      process.exit(1);
    }
  }
}

const app = new App();
app.listen();
