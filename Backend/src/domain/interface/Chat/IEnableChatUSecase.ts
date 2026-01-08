import { IEnableChatOutputDto } from "../../dto/Chat/ChatDto";

export interface IEnableChatUsecase {
    IsBookingExists(userId: string, ownerId: string): Promise<IEnableChatOutputDto>
}