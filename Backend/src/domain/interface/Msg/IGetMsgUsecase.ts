export interface IGetMessagesUsecase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(chatId: string): Promise<any>;
}
