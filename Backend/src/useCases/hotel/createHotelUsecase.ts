import { HotelDto } from "../../domain/dto/Package/HotelDto";
import { ICreateHotelUsecase } from "../../domain/interface/Vendor/IcreateHotelUsecase";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class CreateHotelUsecase implements ICreateHotelUsecase {
  constructor(private _hotelRepo: IHotelRepository) { }

  async execute(data: HotelDto, destinationId: string): Promise<HotelDto> {
    if (!destinationId) {
      throw new Error("Destination is required");
    }

    const existingHotel = await this._hotelRepo.findByName(data.name);
    if (existingHotel) {
      throw new Error("Hotel with this name already exists");
    }
    const hotelDataWithDestination = { ...data, destinationId };
    const hotel = await this._hotelRepo.createHotel(hotelDataWithDestination);

    return mapToHotelDto(hotel);
  }
}
