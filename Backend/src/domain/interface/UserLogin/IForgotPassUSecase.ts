export interface IForgotpassUsecase{
    execute(email:string):Promise<{ message: string }>
}