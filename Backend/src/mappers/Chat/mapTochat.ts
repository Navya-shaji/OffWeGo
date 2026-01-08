import { IChatOut } from "../../domain/dto/Chat/ChatDto";

export const mapToChatOut = (chat: IChatOut): IChatOut => ({
  _id: chat._id,
  lastMessage: chat.lastMessage ?? "",
  lastMessageAt: chat.lastMessageAt ?? new Date(),
  name: chat.name ?? "",
  profile_image: chat.profile_image ?? "",
  isOnline: chat.isOnline ?? false,
  userId: chat.userId,
  vendorId: chat.vendorId,
  unreadCount: chat.unreadCount ?? 0,
});
