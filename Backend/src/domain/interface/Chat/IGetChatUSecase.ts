export interface IGetChatsOfUserUsecase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getChats(userId: string,userType:string): Promise<any[]>;
}
