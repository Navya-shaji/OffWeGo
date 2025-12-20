export interface IInitiateChatUsecase {
    initiateChat(input: { userId: string; ownerId: string }): Promise<any>;
}
