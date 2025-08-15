import { Hotel } from "../../../domain/entities/HotelEntity";
import { IHotelRepository } from "../../../domain/interface/vendor/IHotelRepository";
import {
  HotelModel,
  IHotelModel,
} from "../../../framework/database/Models/HotelModel";

export class HotelRepository implements IHotelRepository {
  async createHotel(data: Hotel): Promise<IHotelModel> {
    return await HotelModel.create(data);
  }
  async getAllHotel(): Promise<IHotelModel[]> {
    return await HotelModel.find();
  }
  async edit(
    id: string,
    updatedData: Partial<Hotel>
  ): Promise<IHotelModel | null> {
    return await HotelModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    await HotelModel.findByIdAndDelete(id);
  }
  async searchHotel(query: string): Promise<Hotel[]> {
    const regex = new RegExp(query, "i");
    return HotelModel.find({ name: { $regex: regex } })
      .select("name")
      .limit(10)
      .exec();
  }
}
