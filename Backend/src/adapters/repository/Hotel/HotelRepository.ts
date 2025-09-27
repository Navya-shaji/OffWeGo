import { Hotel } from "../../../domain/entities/HotelEntity";
import { IHotelRepository } from "../../../domain/interface/Vendor/IHotelRepository";
import {
  HotelModel,
  IHotelModel,
} from "../../../framework/database/Models/HotelModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class HotelRepository
  extends BaseRepository<IHotelModel>
  implements IHotelRepository
{
  constructor() {
    super(HotelModel);
  }
  async createHotel(data: Hotel): Promise<IHotelModel> {
    return this.create(data);
  }
  async getAllHotel(skip: number, limit: number): Promise<IHotelModel[]> {
    return this.model.find().skip(skip).limit(limit);
  }
  async edit(
    id: string,
    updatedData: Partial<Hotel>
  ): Promise<IHotelModel | null> {
    return await HotelModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
  }

  async delete(id: string): Promise<IHotelModel | null> {
    return await HotelModel.findByIdAndDelete(id);
  }

  async searchHotel(query: string): Promise<Hotel[]> {
    const regex = new RegExp(query, "i");
    return HotelModel.find({ name: { $regex: regex } })
      .select("name address" )
      .limit(10)
      .exec();
  }
  async countHotels(): Promise<number> {
    return await HotelModel.countDocuments();
  }
  async findByName(name: string): Promise<Hotel | null> {
    return this.model.findOne({ name });
  }
}
