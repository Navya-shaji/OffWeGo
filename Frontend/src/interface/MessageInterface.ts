export type Imessage = {
    _id: string;
    chatId: string;
    messageContent: string;
    senderId: string;
    senderType: 'user' | 'vendor';
    seen: boolean;
    sendedTime: Date;
    messageType: 'text' | 'image' | 'file';
}
