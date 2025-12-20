export interface IChat {
    _id?: string;           // Other user's ID (for display/navigation)
    chatId?: string;        // Actual chat document ID
    lastMessage: string;
    lastMessageAt: Date;
    name: string;
    profile_image: string;
    isOnline: boolean;
}

export interface IChatPopulated {
    _id?: string;
    lastMessage: string;
    lastMessageAt: Date;
    senderId: {
        _id: string;
        name: string;
        imageUrl?: string;
        profileImage?: string;
    };
    receiverId: {
        _id: string;
        name: string;
        imageUrl?: string;
        profileImage?: string;
    };
    senderType: 'User' | 'vendor';
    receiverType: 'User' | 'vendor';
}