export interface IMessageOut {
    chatId: string,
    seen: boolean,
    messageContent: string,
    sendedTime: Date
    senderId: string;
    senderType: 'User' | 'vendor';
    receiverId?: string;
}