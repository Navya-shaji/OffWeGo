import { ChatDto, Roles } from "../../domain/dto/Chat/chatDto";
import { IChatRepository } from "../../domain/interface/Chat/IchatRepo";
import { ISendChatMessageUseCase } from "../../domain/interface/Chat/IsendChatUsecase";
import {
  mapDtoToChatMessage,
  mapChatMessageToDto,
} from "../../mappers/Chat/mapTochat";

export class SendChatMessageUseCase implements ISendChatMessageUseCase {
  constructor(private _chatRepository: IChatRepository) {}

  async execute(messageDto: ChatDto): Promise<ChatDto> {
    const { senderId, receiverId, senderRole, receiverRole, message } =
      messageDto;

    if (!senderId || !receiverId || !senderRole || !receiverRole || !message) {
      throw new Error(
        "All fields (senderId, receiverId, senderRole, receiverRole, message) are required"
      );
    }
    const allowedRoles = ["user", "vendor"] as const;
    if (!allowedRoles.includes(senderRole as Roles)) {
      throw new Error("Invalid senderRole. Must be 'user' or 'vendor'");
    }
    if (!allowedRoles.includes(receiverRole as Roles)) {
      throw new Error("Invalid receiverRole. Must be 'user' or 'vendor'");
    }

    const chatMessage = mapDtoToChatMessage(messageDto);
    const savedMessage = await this._chatRepository.save(chatMessage);
    return mapChatMessageToDto(savedMessage);
  }
}
