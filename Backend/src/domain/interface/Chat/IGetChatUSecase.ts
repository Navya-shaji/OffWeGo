export interface IGetChatsOfUserUsecase {
    getChats(userId: string,userType:string): Promise<any[]>;
}
