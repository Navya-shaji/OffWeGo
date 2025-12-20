export interface IGetMessagesUsecase {
    execute(chatId: string): Promise<any>;
}
