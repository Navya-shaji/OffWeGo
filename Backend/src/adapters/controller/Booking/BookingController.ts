import { Request, Response } from "express";
import { ICreateBookingUseCase } from "../../../domain/interface/Booking/IBookingUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class BookingController {
    constructor(private createBookingUseCase: ICreateBookingUseCase) {}
    
    async createBooking(req: Request, res: Response): Promise<void> {

    try {
        
      const packageId = req.params.packageId;

      const { userId, selectedDate } = req.body;
     
      if (!userId || !packageId || !selectedDate) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Missing required fields" });
        return;
      }

      const result = await this.createBookingUseCase.execute({
        userId,
        packageId,
        selectedDate: new Date(selectedDate),
      });

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error("CreateBooking Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}
