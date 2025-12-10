export interface IGetChatsOfUserUsecase {
    getChats(userId: string): Promise<any[]>;
}
