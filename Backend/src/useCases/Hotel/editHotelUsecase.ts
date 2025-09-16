import { Hotel } from "../../domain/entities/HotelEntity";
import { IEditHotelUsecase } from "../../domain/interface/vendor/IEdithotelusecase";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class EditHotelusecase implements IEditHotelUsecase {
  constructor(private _hotelRepo: IHotelRepository) {}
  async execute(id: string, updatedData: Hotel): Promise<Hotel | null> {
    const existingHotel = await this._hotelRepo.findByName(updatedData.name);
    if (existingHotel) throw new Error("Hotel with this name already exists");
    const updatedDoc = await this._hotelRepo.edit(id, updatedData);
    return updatedDoc ? mapToHotelDto(updatedDoc) : null;
  }
}
