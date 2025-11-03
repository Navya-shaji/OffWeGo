import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetWalletUserUSecase } from "../../../domain/interface/Wallet/IGetWalletUsecase";
import { ICreateWalletUsecase } from "../../../domain/interface/Wallet/ICreateUserWalletUsecase";

export class WalletController {
  constructor(
    private _createWallet: ICreateWalletUsecase,
    private _getUserWallet: IGetWalletUserUSecase
  ) {}

  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId, ownerType } = req.body;
      console.log(ownerId)
      if (!ownerId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Owner ID is required",
        });
        return;
      }

      const wallet = await this._createWallet.execute(ownerId, ownerType);

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
  async GetUserWallet(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const result = await this._getUserWallet.execute(userId);
    res.status(HttpStatus.OK).json(result);
  }

 
}
