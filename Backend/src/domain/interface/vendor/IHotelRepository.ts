import { IHotelModel } from "../../../framework/database/Models/HotelModel";
import { Hotel } from "../../entities/HotelEntity";

export interface IHotelRepository {
  createHotel(data: Hotel): Promise<IHotelModel>;
  getAllHotel(skip:number,limit:number): Promise<IHotelModel[]>;
  edit(id: string, updatedData: Partial<Hotel>): Promise<IHotelModel | null>;
  delete(id: string): Promise<void>;
  searchHotel(query: string): Promise<Hotel[]>;
  countHotels():Promise<number>
}
