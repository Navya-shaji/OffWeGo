import { ICreateBookingUseCase } from "../../../domain/interface/Booking/ICreateBookingUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class BookingController {
  constructor(private _createBooking: ICreateBookingUseCase) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    const booking = req.body;
    const result = await this._createBooking.execute(booking);
    res.status(HttpStatus.CREATED).json({ success: true, booking: result });
  }
}
