import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors"
import { ConnectDB } from "./framework/database/connectDB/connectDB";
import { UserRoute } from "./framework/routes/user/userRoute";
import { AdminRoute } from "./framework/routes/Admin/adminRoute";
import morgan from 'morgan'
import { VendorRoute } from "./framework/routes/Vendor/vendorRoute";


export class App {
  private app: Express;
  private database: ConnectDB;
  private server!: http.Server;

  constructor() {
    dotenv.config();
    this.app = express();
    this.database = new ConnectDB();

  
    this.app.use(cors({
            origin: process.env.ORIGIN,
            credentials: true
        }))
    this.setMiddlewares();
    this.setUserRoutes();
    this.setAdminRoutes()
    this.setVendorRoutes()
  }

  private setMiddlewares(): void {
    this.app.use(express.json());
    
    this.app.use(morgan('dev'));
    
    
  }

  private setUserRoutes(): void {
    this.app.use("/api", new UserRoute().userRouter);
  }
  private setAdminRoutes():void{
    this.app.use("/api/admin",new AdminRoute().adminRouter)
  }
  private setVendorRoutes():void{
    this.app.use("/api/vendor",new VendorRoute().vendorRouter)
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 1212;

    try {
      await this.database.connect(); 
      this.server = this.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to connect to DB:", error);
      process.exit(1);
    }
  }
}

const app = new App();
app.listen();
