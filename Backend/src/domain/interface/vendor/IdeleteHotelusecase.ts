export interface IDeleteHotelUsecase{
    execute(id:string):Promise <{success:boolean;message:string}>
}