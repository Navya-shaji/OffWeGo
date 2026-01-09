import { Flight } from "../../domain/entities/FlightEntity";
import { IFlightModel } from "../../framework/database/Models/flightModel";

export const mapToFlightDto = (doc: IFlightModel): Flight => ({
  id: doc._id.toString(),
  airLine: doc.airLine,
  price: {
    economy: doc.price.economy,  
    premium: doc.price.premium,
    business: doc.price.business
  },
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});
