import { ChatRepository } from "../../adapters/repository/Chat/chatRepository";
import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository";

export class InitiateChatUsecase {
    constructor(
        private chatRepository: ChatRepository,
        private bookingRepository: BookingRepository
    ) { }

    async execute(userId: string, ownerId: string): Promise<any> {
        return await this.initiateChat({ userId, ownerId });
    }

    async initiateChat(input: { userId: string; ownerId: string }): Promise<any> {
        const { userId: initiatorId, ownerId: otherPersonId } = input;
        
        if (!initiatorId || !otherPersonId) {
            throw new Error("Both userId and ownerId are required to initiate a chat.");
        }

   
        let chat = await this.chatRepository.getchatOfUser(initiatorId, otherPersonId).catch(() => null);
        
        if (chat) {
   
            let otherUser = null;
            
  
            if (chat.userId && (chat.userId._id?.toString() === initiatorId || chat.userId.toString() === initiatorId)) {
                otherUser = chat.vendorId;
            } else if (chat.vendorId && (chat.vendorId._id?.toString() === initiatorId || chat.vendorId.toString() === initiatorId)) {
                otherUser = chat.userId;
            } else if (chat.userId && (chat.userId._id?.toString() === otherPersonId || chat.userId.toString() === otherPersonId)) {
                otherUser = chat.vendorId;
            } else if (chat.vendorId && (chat.vendorId._id?.toString() === otherPersonId || chat.vendorId.toString() === otherPersonId)) {
                otherUser = chat.userId;
            }
            
            if (!otherUser) {
                throw new Error("Other user data is missing in the chat.");
            }
            
            const profileImage = 'profileImage' in otherUser
                ? otherUser.profileImage
                : otherUser.imageUrl || "";
            
         
            const userIdValue = typeof chat.userId === 'object'
                ? (chat.userId._id?.toString() || chat.userId.toString())
                : chat.userId.toString();
            
            const vendorIdValue = typeof chat.vendorId === 'object'
                ? (chat.vendorId._id?.toString() || chat.vendorId.toString())
                : chat.vendorId.toString();
            
            return {
                ...chat.toObject ? chat.toObject() : chat,
                _id: chat._id,
                name: otherUser.name || "Unknown",
                profile_image: profileImage,
                isOnline: true,
                lastMessage: chat.lastMessage || "",
                lastMessageAt: chat.lastMessageAt || new Date(),
                userId: userIdValue,
                vendorId: vendorIdValue,
            };
        }


        const newChat = {
            userId: initiatorId,
            vendorId: otherPersonId,
            lastMessage: "",
            lastMessageAt: new Date(),
        };

        const createdChat = await this.chatRepository.createChat(newChat);
        
        if (!createdChat) {
            throw new Error("Error while creating new chat");
        }


        const chatDoc = createdChat as any;
        

        let otherUser = null;
        if (chatDoc.userId && (typeof chatDoc.userId === 'object' ? (chatDoc.userId._id?.toString() === initiatorId || chatDoc.userId._id?.toString() === otherPersonId) : chatDoc.userId.toString() === initiatorId)) {
            otherUser = chatDoc.vendorId;
        } else if (chatDoc.vendorId && (typeof chatDoc.vendorId === 'object' ? (chatDoc.vendorId._id?.toString() === initiatorId || chatDoc.vendorId._id?.toString() === otherPersonId) : chatDoc.vendorId.toString() === initiatorId)) {
            otherUser = chatDoc.userId;
        }
        
        if (!otherUser || (typeof otherUser !== 'object' || !otherUser.name)) {
            throw new Error("Other user data is missing in the chat.");
        }
        
        const profileImage = 'profileImage' in otherUser
            ? otherUser.profileImage
            : otherUser.imageUrl || "";
        
        const chatObj = chatDoc.toObject ? chatDoc.toObject() : (typeof chatDoc === 'object' ? chatDoc : {});
        

        const userIdValue = typeof chatDoc.userId === 'object'
            ? (chatDoc.userId._id?.toString() || chatDoc.userId.toString())
            : chatDoc.userId.toString();
        
        const vendorIdValue = typeof chatDoc.vendorId === 'object'
            ? (chatDoc.vendorId._id?.toString() || chatDoc.vendorId.toString())
            : chatDoc.vendorId.toString();
        
        return {
            ...chatObj,
            _id: chatDoc._id,
            userId: userIdValue,
            vendorId: vendorIdValue,
            name: otherUser.name || "Unknown",
            profile_image: profileImage,
            isOnline: true,
            lastMessage: chatDoc.lastMessage || "",
            lastMessageAt: chatDoc.lastMessageAt || new Date()
        };
    }
}
