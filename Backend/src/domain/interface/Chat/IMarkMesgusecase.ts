export interface IMarkMessagesSeenUseCase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(chatId: string, userId: string): Promise<any>;
}
