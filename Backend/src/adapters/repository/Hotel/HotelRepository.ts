import { Hotel } from "../../../domain/entities/HotelEntity";
import { IHotelRepository } from "../../../domain/interface/vendor/IHotelRepository";
import { HotelModel, IHotelModel } from "../../../framework/database/Models/HotelModel";

export class HotelRepository implements IHotelRepository{
    async createHotel(data: Hotel): Promise<IHotelModel> {
        return await HotelModel.create(data)
    }
    async getAllHotel(): Promise<IHotelModel[]> {
        return await HotelModel.find()
    }
}