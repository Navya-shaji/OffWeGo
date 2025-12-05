import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetWalletUSecase } from "../../../domain/interface/Wallet/IGetWalletUsecase";
import { ICreateWalletUsecase } from "../../../domain/interface/Wallet/ICreateUserWalletUsecase";
import { ITransferAmountUseCase } from "../../../domain/interface/Wallet/ITransferWalletAmountUsecase";
import { IGetCompletedBookingsUseCase } from "../../../domain/interface/Wallet/ICompletedBookings";
import { IWalletPaymentUseCase } from "../../../domain/interface/Wallet/IWalletPayment";
import { ICompleteTripUseCase } from "../../../domain/interface/Wallet/ICompletedTripUsecase";

export class WalletController {
  constructor(
    private _createWallet: ICreateWalletUsecase,
    private _getWallet: IGetWalletUSecase,
    private _transferWallet: ITransferAmountUseCase,
    private _getCompletedBookings: IGetCompletedBookingsUseCase,
    private _walletPaymentUseCase: IWalletPaymentUseCase,
    private _completeTripUseCase: ICompleteTripUseCase
  ) {}

  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId, ownerType } = req.body;
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

  async GetWallet(req: Request, res: Response): Promise<void> {
    const Id = req.params.id;
    const result = await this._getWallet.execute(Id);
    res.status(HttpStatus.OK).json(result);
  }

  async TransferWalletAmount(req: Request, res: Response): Promise<void> {
    try {
      const { adminId, vendorId, amount } = req.body;
      await this._transferWallet.execute(adminId, vendorId, amount);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Transferred 90% of ${amount} from admin ${adminId} to vendor ${vendorId}`,
      });
    } catch (error) {
      console.error("Error transferring wallet amount:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to transfer amount",
      });
    }
  }

  async getCompletedBookingsForTransfer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const completedBookings = await this._getCompletedBookings.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Completed bookings fetched successfully",
        data: completedBookings,
      });
    } catch (error) {
      console.error("Error fetching completed bookings:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch completed bookings",
      });
    }
  }

  async walletPayment(req: Request, res: Response): Promise<void> {
    try {
      const { userId, amount, description } = req.body;

      if (!userId || !amount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "userId and amount are required",
        });
        return;
      }

      const result = await this._walletPaymentUseCase.execute(
        userId,
        amount,
        description || "Wallet Payment"
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Amount debited successfully",
        balance: result.newBalance,
      });
    } catch (error) {
      console.error("Error debiting wallet amount:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to debit wallet",
      });
    }
  }
  async completeTripAndDistribute(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, vendorId, adminId, totalAmount } = req.body;
      console.log(bookingId, vendorId, adminId, totalAmount)
console.log(req.body,"req.body")
      if (!bookingId || !vendorId || !adminId || !totalAmount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "bookingId, driverId, adminId and totalAmount are required",
        });
        return;
      }

      await this._completeTripUseCase.execute(
        bookingId,
        vendorId,
        adminId,
        totalAmount
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Trip completed and funds distributed successfully",
      });
    } catch (error) {
      console.error("Error completing trip:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to complete trip",
      });
    }
  }
}
