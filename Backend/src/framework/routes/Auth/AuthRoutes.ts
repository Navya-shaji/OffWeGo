import { Request, Response, Router } from "express";
import { refreshTokenController } from "../../Di/RefreshToken/refreshtokenInjection";  
import { CommonRoutes } from "../Constants/commonRoutes"; 

export class CommonRoute {
  public commonRouter: Router;

  constructor() {
    this.commonRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
  
    this.commonRouter.post(
      CommonRoutes.REFRESH_TOKEN,
      (req: Request, res: Response) => {
        refreshTokenController.handle(req, res);
      }
    );
  }
}
