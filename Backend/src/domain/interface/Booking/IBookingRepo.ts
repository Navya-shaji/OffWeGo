export interface IBookingRepository {
  createBooking(data: {
    userId: string;
    packageId: string;
    selectedDate: Date;
  }): Promise<{ success: boolean; message: string }>;

  getUsersByPackage(packageId: string): Promise<any[]>;
}