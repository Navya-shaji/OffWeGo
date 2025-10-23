export interface IDeleteSubscriptionUsecase{
    execute(id:string):Promise<{success:boolean;messsege:string}>
}