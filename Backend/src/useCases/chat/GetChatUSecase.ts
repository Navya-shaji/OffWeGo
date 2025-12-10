import { ChatRepository } from "../../adapters/repository/Chat/chatRepository";
import { IChatOut } from "../../domain/dto/Chat/chatDto";
import { IGetChatsOfUserUsecase } from "../../domain/interface/Chat/IGetChatUSecase";
import { mapToChatOut } from "../../mappers/Chat/mapTochat";

export class GetChatsOfUserUsecase implements IGetChatsOfUserUsecase {
  constructor(private _chatRepository: ChatRepository) {}

  async getChats(userId: string) {
    const result = await this._chatRepository.findChatsOfUser(userId);
    const chats = result?.chats || [];

    if (!Array.isArray(chats)) {
      console.error(
        "findChatsOfUser did not return an array in chats property:",
        result
      );
      return [];
    }

    const formattedChats = chats
      .map((chat: IChatOut) => {
        if (!chat.userId || !chat.vendorId) {
          console.warn("Chat missing populated fields:", chat._id);
          return null;
        }

        const otherUser =
          chat.userId._id?.toString() === userId ||
          chat.userId.toString() === userId
            ? chat.vendorId
            : chat.userId;

        const userIdValue =
          typeof chat.userId === "object"
            ? chat.userId._id?.toString() || chat.userId.toString()
            : chat.userId.toString();

        const vendorIdValue =
          typeof chat.vendorId === "object"
            ? chat.vendorId._id?.toString() || chat.vendorId.toString()
            : chat.vendorId.toString();

        return {
          _id: chat._id,
          name: otherUser?.name || "Unknown",
          profile_image: otherUser?.imageUrl || otherUser?.profileImage || "",
          isOnline: true,
          lastMessage: chat.lastMessage || "",
          lastMessageAt: chat.lastMessageAt || new Date(),
          userId: userIdValue,
          vendorId: vendorIdValue,
        };
      })
      .filter((chat: unknown) => chat !== null);

    return formattedChats.map((chat: any) => mapToChatOut(chat));
  }
}
