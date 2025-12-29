import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetUserBookingUsecase } from "../../../domain/interface/Booking/IGetUserBookingUsecase";
import { IGetVendorSideBookingUsecase } from "../../../domain/interface/Booking/IGetVendorSideBookingUsecase";
import { IBookingDatesUsecase } from "../../../domain/interface/Booking/IBookingDatesUsecase";
import { ICancelBookingUsecase } from "../../../domain/interface/Booking/ICancelBookingUSecase";
import { IBookingRescheduleUseCase } from "../../../domain/interface/Booking/IBookingResheduleusecase";
import { Traveler } from "../../../domain/entities/BookingEntity";

export class BookingController {
  constructor(
    private _createBookingUsecase: ICreateBookingUseCase,
    private _userbookingsUsecase: IGetUserBookingUsecase,
    private _vendorsidebookingUsecase: IGetVendorSideBookingUsecase,
    private _bookingDatesUsecase: IBookingDatesUsecase,
    private _cancelBookingUsecase: ICancelBookingUsecase,
    private _rescheduleBookingUsecase: IBookingRescheduleUseCase,
   
  ) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { data, payment_id, paymentStatus } = req.body;
      const result = await this._createBookingUsecase.execute({
        data,
        payment_id,
        paymentStatus,
      });

      res.status(HttpStatus.CREATED).json({ success: true, booking: result });
    } catch (error) {
      console.error("Error creating booking:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const bookings = await this._userbookingsUsecase.execute(userId);

      res.status(HttpStatus.OK).json({ success: true, bookings });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async getVendorsideBookings(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId;
      const bookings = await this._vendorsidebookingUsecase.execute(vendorId);
      res.status(HttpStatus.OK).json({ success: true, bookings });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async bookingDates(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId;
      const booking_dates = await this._bookingDatesUsecase.execute(vendorId);

      res.status(HttpStatus.OK).json({
        success: true,
        booking_dates: booking_dates,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error,
      });
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id;
      const reason = req.body?.reason;
      console.log("Cancelling booking:", bookingId, "Reason:", reason);
      const booking = await this._cancelBookingUsecase.execute(bookingId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Booking cancelled successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Cancel booking error:", error);
      const errorMessage = "Failed to cancel booking";
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: errorMessage,
        error: errorMessage,
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
        message: "Booking rescheduled successfully",
        booking: updatedBooking,
      });
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Failed to reschedule booking",
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
        message: "Booking created successfully with wallet payment",
        booking,
      });
    } catch (error) {
      console.error("Error creating booking with wallet:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create booking",
        error: (error as Error).message,
      });
    }
  }
}
