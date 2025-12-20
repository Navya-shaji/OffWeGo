import { IEnableChatOutputDto } from "../../dto/Chat/chatDto";

export interface IEnableChatUsecase {
    IsBookingExists(userId: string, ownerId: string): Promise<IEnableChatOutputDto>
}