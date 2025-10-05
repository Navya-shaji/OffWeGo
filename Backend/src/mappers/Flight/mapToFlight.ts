import { Flight } from "../../domain/entities/flightEntity";
import { IFlightModel } from "../../framework/database/Models/flightModel"; 

export const mapToFlightDto = (doc: IFlightModel): Flight => ({
  id: doc._id.toString(),       
  date: doc.date,
  fromLocation: doc.fromLocation,
  toLocation: doc.toLocation,
  airLine: doc.airLine,         
  price: doc.price,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});
