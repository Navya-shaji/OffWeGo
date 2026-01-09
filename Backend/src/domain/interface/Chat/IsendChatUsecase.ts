export interface IInitiateChatUsecase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initiateChat(input: { userId: string; ownerId: string }): Promise<any>;
}
