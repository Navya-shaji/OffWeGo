import { IDeleteHotelUsecase } from "../../domain/interface/vendor/IdeleteHotelusecase";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";

export class DeleteHotelUsecase implements IDeleteHotelUsecase {
  constructor(private _hotelRepo: IHotelRepository) {}
  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this._hotelRepo.delete(id);
    return { success: true, message: "Hotel deleted successfully" };
  }
}
