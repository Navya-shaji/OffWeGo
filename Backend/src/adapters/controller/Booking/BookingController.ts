import { Request, Response } from "express";
import { ICreateBookingUseCase } from "../../../domain/interface/Booking/IBookingUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class BookingController {
  constructor(private _createBookingUseCase: ICreateBookingUseCase) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    const packageId = req.params.packageId;

    const { userId, selectedDate } = req.body;

    if (!userId || !packageId || !selectedDate) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const result = await this._createBookingUseCase.execute({
      userId,
      packageId,
      selectedDate: new Date(selectedDate),
    });

    res.status(HttpStatus.CREATED).json(result);
  }
}
