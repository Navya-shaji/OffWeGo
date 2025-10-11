import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetUserBookingUsecase } from "../../../domain/interface/Booking/IGetUserBookingUsecase";

export class BookingController {
  constructor(
    private _createBooking: ICreateBookingUseCase,
    private _userbookings: IGetUserBookingUsecase
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
}
