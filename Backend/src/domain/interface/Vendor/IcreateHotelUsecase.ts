import { HotelDto } from "../../dto/Package/HotelDto";

export interface ICreateHotelUsecase {
    execute(data: HotelDto, destinationId: string): Promise<HotelDto>
}