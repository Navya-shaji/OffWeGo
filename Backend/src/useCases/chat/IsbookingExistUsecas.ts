import { IEnableChatOutputDto } from "../../domain/dto/Chat/chatDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IEnableChatUsecase } from "../../domain/interface/Chat/IEnableChatUSecase";


export class EnableChatUsecase implements IEnableChatUsecase {
    private _bookingRepository: IBookingRepository;

    constructor(bookingRepository: IBookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async IsBookingExists(userId: string, ownerId: string): Promise<IEnableChatOutputDto> {
        try {
            const booking = await this._bookingRepository.checkBookingExistsBetweenUserAndOwner(
                userId,
                ownerId
            );

            if (booking) {
                return {
                    canChat: true,
                    message: "Chat enabled — active booking exists between user and owner"
                };
            }

            return {
                canChat: false,
                message: "Chat disabled — no active booking found between user and owner"
            };

        } catch (error) {
            console.error("Error checking booking:", error);
            return {
                canChat: false,
                message: "An error occurred while checking booking status"
            };
        }
    }
}
