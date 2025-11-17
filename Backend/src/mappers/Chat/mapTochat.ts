import { ChatDto } from "../../domain/dto/Chat/chatDto";
import { ChatMessage } from "../../domain/entities/chatEntity";

// DTO → Entity
export const mapDtoToChatMessage = (dto: ChatDto): ChatMessage => ({
  senderId: dto.senderId,
  receiverId: dto.receiverId,
  senderRole: dto.senderRole as "user" | "vendor",
  receiverRole: dto.receiverRole as "user" | "vendor",
  message: dto.message,
  createdAt: dto.createdAt ?? new Date(),
});

// Entity → DTO
export const mapChatMessageToDto = (chat: ChatMessage): ChatDto => ({
  senderId: chat.senderId,
  receiverId: chat.receiverId,
  senderRole: chat.senderRole, 
  receiverRole: chat.receiverRole,
  message: chat.message,
  createdAt: chat.createdAt,
});
