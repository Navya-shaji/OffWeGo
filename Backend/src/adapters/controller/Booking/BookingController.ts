import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetUserBookingUsecase } from "../../../domain/interface/Booking/IGetUserBookingUsecase";
import { IGetVendorSideBookingUsecase } from "../../../domain/interface/Booking/IGetVendorSideBookingUsecase";
import { IBookingDatesUsecase } from "../../../domain/interface/Booking/IBookingDatesUsecase";

export class BookingController {
  constructor(
    private _createBooking: ICreateBookingUseCase,
    private _userbookings: IGetUserBookingUsecase,
    private _vendorsidebookings: IGetVendorSideBookingUsecase,
    private _bookingDates: IBookingDatesUsecase
  ) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { data, payment_id, paymentStatus } = req.body;
      const result = await this._createBooking.execute({
        data,
        payment_id,
        paymentStatus,
      });

      console.log("Booking created:", result);
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
      const userId = req.params.userId;
      console.log(userId);
      const bookings = await this._userbookings.execute(userId);
      console.log(bookings);
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
      const bookings = await this._vendorsidebookings.execute(vendorId);
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
    console.log(vendorId);

    // Await the result
    const booking_dates = await this._bookingDates.execute(vendorId);

    res.status(HttpStatus.OK).json({
      success: true,
      booking_dates: booking_dates, // correctly return the array
    });
  } catch (error) {
    console.error("Error fetching user booking dates:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
     error,
    });
  }
}

}
