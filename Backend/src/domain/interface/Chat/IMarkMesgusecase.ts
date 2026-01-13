export interface IMarkMessagesSeenUseCase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(chatId: string, userId: string, userType?: 'user' | 'vendor'): Promise<any>;
}
