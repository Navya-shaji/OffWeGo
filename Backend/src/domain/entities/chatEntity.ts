import { Types } from "mongoose"

export interface IChat {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    userId: string | Types.ObjectId,
    vendorId: string | Types.ObjectId

}

export interface IChatPopulated {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    userId: {
        _id: string,
        name: string,
        imageUrl?: string
        profileImage?:string
    },
    vendorId: {
        _id: string,
        name: string,
         imageUrl?: string
        profileImage?:string
    }

}