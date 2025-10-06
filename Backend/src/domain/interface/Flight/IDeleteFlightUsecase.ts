export interface IDeleteFlightUsecase{
    execute(id:string):Promise<{success:boolean,messege:string}>
}