import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { IGetUserBookingUsecase } from "../../../domain/interface/Booking/IGetUserBookingUsecase";
import { IGetVendorSideBookingUsecase } from "../../../domain/interface/Booking/IGetVendorSideBookingUsecase";
import { IBookingDatesUsecase } from "../../../domain/interface/Booking/IBookingDatesUsecase";
import { ICancelBookingUsecase } from "../../../domain/interface/Booking/ICancelBookingUSecase";
import { IBookingRescheduleUseCase } from "../../../domain/interface/Booking/IBookingRescheduleUseCase";
import { Traveler } from "../../../domain/entities/BookingEntity";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";
import { AppError } from "../../../domain/errors/AppError";

export class BookingController {
  constructor(
    private _createBookingUsecase: ICreateBookingUseCase,
    private _userbookingsUsecase: IGetUserBookingUsecase,
    private _vendorsidebookingUsecase: IGetVendorSideBookingUsecase,
    private _bookingDatesUsecase: IBookingDatesUsecase,
    private _cancelBookingUsecase: ICancelBookingUsecase,
    private _rescheduleBookingUsecase: IBookingRescheduleUseCase
  ) { }

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { data, payment_id, paymentStatus } = req.body;

      const result = await this._createBookingUsecase.execute({
        data,
        payment_id,
        paymentStatus,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: success.SUCCESS_MESSAGES.CREATED,
        data: result,
      });
    } catch (error) {
      console.error("Create booking error:", error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      // Handle generic Error with message
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const bookings = await this._userbookingsUsecase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getVendorsideBookings(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId;

      const bookings = await this._vendorsidebookingUsecase.execute(vendorId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async bookingDates(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId;

      const bookingDates = await this._bookingDatesUsecase.execute(vendorId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: bookingDates,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;

      const booking = await this._cancelBookingUsecase.execute(bookingId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.DELETED,
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      if (error instanceof AppError) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: ErrorMessages.BOOKING_FAILED,
      });
    }
  }

  async rescheduleBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const { newDate } = req.body;

      const updatedBooking = await this._rescheduleBookingUsecase.execute({
        bookingId,
        newDate: new Date(newDate),
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.UPDATED,
        data: updatedBooking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: ErrorMessages.BOOKING_FAILED,
      });
    }
  }

  async createBookingWithWallet(req: Request, res: Response): Promise<void> {
    try {
      const { data: bookingData, payment_id, description } = req.body;

      const adults =
        bookingData.adults?.filter(
          (a: Traveler) => a.name && a.name.trim() !== ""
        ) || [];

      const children =
        bookingData.children?.filter(
          (c: Traveler) => c.name && c.name.trim() !== ""
        ) || [];

      const bookingPayload = {
        data: {
          ...bookingData,
          adults,
          children,
          paymentMethod: "wallet",
          paymentDetails: {
            type: "debit",
            description: description || "Booking Payment",
            date: new Date(),
          },
        },
        payment_id: payment_id || "",
        paymentStatus: "succeeded" as const,
      };

      const booking = await this._createBookingUsecase.execute(bookingPayload);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: success.SUCCESS_MESSAGES.CREATED,
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
