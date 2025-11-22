import { IChatOut, ICreateChatDto } from "../../domain/dto/Chat/chatDto";
import { IChat } from "../../domain/entities/chatEntity";
import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { IInitiateChatUsecase } from "../../domain/interface/Chat/IsendChatUsecase";

export class InitiateChatUsecase implements IInitiateChatUsecase {
    private chatRepository: IChatRepository;

    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository;
    }

    async initiateChat(input: ICreateChatDto): Promise<IChatOut> {
        const { userId, ownerId } = input;

        const existingChat = await this.chatRepository.getchatOfUser(userId, ownerId);

        if (existingChat) {
            const otherUser =
                existingChat.senderId._id.toString() === userId
                    ? existingChat.receiverId
                    : existingChat.senderId;

            return {
                _id: existingChat._id,
                name: otherUser.name,
                profile_image: otherUser.profile_image || "",
                isOnline: true,  
                lastMessage: existingChat.lastMessage,
                lastMessageAt: existingChat.lastMessageAt,
            };
        }


        const newChat: IChat = {
            senderId: userId,
            receiverId: ownerId,
            senderType: "user",
            receiverType: "vendor",
            lastMessage: "",
            lastMessageAt: new Date(),
        };

        const createdChat = await this.chatRepository.createChat(newChat);

        if (!createdChat) throw new Error("Error while creating new chat");

        const otherUser =
            createdChat.senderId._id.toString() === userId
                ? createdChat.receiverId
                : createdChat.senderId;

        return {
            _id: createdChat._id,
            name: otherUser.name,
            profile_image: otherUser.profile_image || "",
            isOnline: true,
            lastMessage: createdChat.lastMessage,
            lastMessageAt: createdChat.lastMessageAt,
        };
    }
}
