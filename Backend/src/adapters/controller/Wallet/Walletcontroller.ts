import { Request, Response } from "express";
import { ICreateUserWalletUsecase } from "../../../domain/interface/Wallet/ICreateUserWalletUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class WalletController {
  constructor(private _createUserWallet: ICreateUserWalletUsecase) {}

  async createUserWallet(req: Request, res: Response): Promise<void> {
    try {
    
      const {ownerId, ownerType } = req.body;
      if (!ownerId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Owner ID is required",
        });
        return;
      }

      const wallet = await this._createUserWallet.execute(ownerId, ownerType);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Wallet created successfully",
        data: wallet,
      });
    } catch (error) {
      console.error("Error creating wallet:", error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create wallet",
      });
    }
  }
}
