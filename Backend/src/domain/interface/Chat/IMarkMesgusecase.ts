export interface IMarkMessagesSeenUseCase {
    execute(chatId: string, userId: string): Promise<any>;
}
