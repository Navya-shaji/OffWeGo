export interface IBookingDatesUsecase{
    execute(vendorID:string):Promise<Date[]>
}