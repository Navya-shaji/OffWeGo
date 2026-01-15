import { HotelDto } from "../../domain/dto/Package/HotelDto";
import { IEditHotelUsecase } from "../../domain/interface/Vendor/IEdithotelusecase";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class EditHotelusecase implements IEditHotelUsecase {
  constructor(private _hotelRepo: IHotelRepository) { }
  async execute(id: string, updatedData: HotelDto): Promise<HotelDto | null> {
    const existingHotel = await this._hotelRepo.findByName(updatedData.name);

    if (existingHotel && existingHotel.hotelId) throw new Error("Hotel with this name already exists");
    const updatedDoc = await this._hotelRepo.edit(id, updatedData);
    return updatedDoc ? mapToHotelDto(updatedDoc) : null;
  }
}
