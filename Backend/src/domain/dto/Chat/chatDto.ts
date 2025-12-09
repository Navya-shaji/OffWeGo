

export interface IChatOut {
    _id?: string,
    lastMessage: string;
    lastMessageAt: Date;
    name: string;
    profile_image: string;
    isOnline: boolean;
    userId?: any;
    vendorId?: any;
}

export interface IMessageOut {
    chatId: string;
    senderId: string;
    messageContent: string;
    sendedTime: string;
}
export interface ICreateChatDto {
    userId: string;
    ownerId: string;
}


export interface IEnableChatOutputDto {
    canChat: boolean; message: string
}