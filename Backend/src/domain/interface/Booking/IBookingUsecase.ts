
export interface ICreateBookingUseCase {
  execute(data: {
    userId: string;
    packageId: string;
    selectedDate: Date;
  }): Promise<{ success: boolean; message: string }>;
}
