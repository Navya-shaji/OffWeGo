export interface IForgotpassUsecase{
    execute(email:string):Promise<void>
}