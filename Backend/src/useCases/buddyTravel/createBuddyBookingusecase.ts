import { BuddyBookingDto } from "../../domain/dto/Booking/buddyBookingDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IcreateBuddyBooking } from "../../domain/interface/BuddyTravel/IcreateBuddyBokkkingUsecase";
import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";

export class CreateBuddyBookingUsecase  implements IcreateBuddyBooking{
    constructor(
       private  _bookingRepo:IBookingRepository,
      
    ){}

    // Map BuddyBookingDto to BuddyTravel
    private mapDtoToEntity(dto: BuddyBookingDto): BuddyTravel {
        return {
            id: dto.id,
            title: dto.title,
            destination: dto.destination,
            location: dto.destination, // Use destination as location if not provided
            startDate: dto.startDate,
            endDate: dto.endDate,
            price: dto.price,
            maxPeople: dto.maxPeople,
            joinedUsers: dto.joinedUsers,
            description: dto.description,
            categoryId: dto.category, // Map category string to categoryId
            category: dto.category, // Keep for backward compatibility
            status: dto.status,
            tripStatus: "UPCOMING", // Default trip status
            vendorId: dto.vendorId,
            isApproved: dto.isApproved,
        };
    }

    // Map BuddyTravel to BuddyBookingDto
    private mapEntityToDto(entity: BuddyTravel): BuddyBookingDto {
        return {
            id: entity.id,
            title: entity.title,
            destination: entity.destination,
            startDate: entity.startDate,
            endDate: entity.endDate,
            price: entity.price,
            maxPeople: entity.maxPeople,
            joinedUsers: entity.joinedUsers,
            description: entity.description,
            category: entity.categoryId || entity.category || "",
            status: entity.status as 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'APPROVED',
            vendorId: entity.vendorId,
            isApproved: entity.isApproved,
        };
    }

    async execute(booking: BuddyBookingDto): Promise<BuddyBookingDto> {
        const entity = this.mapDtoToEntity(booking);
        const result = await this._bookingRepo.createbuddyBooking(entity);
        return this.mapEntityToDto(result);
    }
}