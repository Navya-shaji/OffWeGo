export type Imessage = {
    _id: string;
    chatId: string;
    messageContent: string;
    senderId: string;
    senderType: 'User' | 'vendor';
    receiverId?: string;
    seen: boolean;
    sendedTime: Date;
    messageType: 'text' | 'image' | 'file';
}
