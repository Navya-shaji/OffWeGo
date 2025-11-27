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

    if (!userId || !ownerId) {
      throw new Error(
        "Both userId and ownerId are required to initiate a chat."
      );
    }

    let chat = await this.chatRepository.getchatOfUser(userId, ownerId);

    if (!chat) {
      const newChat: IChat = {
        userId: userId,
        vendorId: ownerId,
        lastMessage: "",
        lastMessageAt: new Date(),
      };

      chat = await this.chatRepository.createChat(newChat);
      if (!chat) throw new Error("Error while creating new chat");
    }

    const otherUser =
      chat.userId && chat.vendorId._id.toString() === userId
        ? chat.vendorId
        : chat.userId;

    if (!otherUser) {
      throw new Error("Other user data is missing in the chat.");
    }

    return {
      _id: chat._id,
      name: otherUser.name || "Unknown",
      profile_image: otherUser.imageUrl || otherUser.profileImage || "",
      isOnline: true,
      lastMessage: chat.lastMessage || "",
      lastMessageAt: chat.lastMessageAt || new Date(),
    };
  }
}
