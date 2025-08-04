
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepo";
import { BookingModel } from "../../../framework/database/Models/BookingModel"; 

export class BookingRepository implements IBookingRepository {
  async createBooking(data: {
    userId: string;
    packageId: string;
    selectedDate: Date;
  }): Promise<{ success: boolean; message: string }> {
    const booking = new BookingModel(data);
    await booking.save();
    return { success: true, message: "Booking created successfully" };
  }

  async getUsersByPackage(packageId: string): Promise<any[]> {
    return await BookingModel.find({ packageId })
      .populate("userId", "name email imageUrl")
      .lean();
  }
}
