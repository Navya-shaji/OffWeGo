export interface IForgotpassUsecase {
    execute(email: string): Promise<{ success: boolean; message: string }>
}