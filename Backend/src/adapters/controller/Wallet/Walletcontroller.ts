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
    private _createWalletUsecase: ICreateWalletUsecase,
    private _getWalletUsecase: IGetWalletUSecase,
    private _transferAmountUsecase: ITransferAmountUseCase,
    private _getCompletedBookingsUsecase: IGetCompletedBookingsUseCase,
    private _walletPaymentUsecase: IWalletPaymentUseCase,
    private _completeTripUsecase: ICompleteTripUseCase
  ) {}

  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId, ownerType } = req.body;
      const wallet = await this._createWalletUsecase.execute(
        ownerId,
        ownerType
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Wallet created successfully",
        data: wallet,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create wallet",
        error,
      });
    }
  }

  async GetWallet(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this._getWalletUsecase.execute(id);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch wallet",
        error,
      });
    }
  }

  async TransferWalletAmount(req: Request, res: Response): Promise<void> {
    try {
      const { adminId, vendorId, amount } = req.body;

      await this._transferAmountUsecase.execute(adminId, vendorId, amount);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Transferred 90% of ${amount} from admin ${adminId} to vendor ${vendorId}`,
      });
    } catch (error) {
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
      const completedBookings =
        await this._getCompletedBookingsUsecase.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Completed bookings fetched successfully",
        data: completedBookings,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch completed bookings",
        error,
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

      const result = await this._walletPaymentUsecase.execute(
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to debit wallet",
      });
    }
  }

  async completeTripAndDistribute(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, vendorId, adminId, totalAmount } = req.body;

      if (!bookingId || !vendorId || !adminId || !totalAmount) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "bookingId, vendorId, adminId and totalAmount are required",
        });
        return;
      }

      await this._completeTripUsecase.execute(
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to complete trip",
      });
    }
  }
}
