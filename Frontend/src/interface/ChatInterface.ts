
export interface IChat {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    senderId: string 
    receiverId: string 
    senderType: 'user' | 'vendor'
    receiverType: 'user' | 'vendor'
}

export interface IChatPopulated {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    senderId: {
        _id: string,
        name: string,
        imageUrl?: string
        profileImage?:string
    },
    receiverId: {
        _id: string,
        name: string,
         imageUrl?: string
        profileImage?:string
    }
    senderType: 'user' | 'vendor'
    receiverType: 'user' | 'vendor'
}