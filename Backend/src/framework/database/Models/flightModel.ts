import {model,Document,ObjectId} from "mongoose"
import { Flight } from "../../../domain/entities/flightEntity"
import { flightSchema } from "../Schema/flightSchema"

export interface IFlightModel extends Omit <Flight,"id">,Document{
    _id:ObjectId
}

export const flightModel=model<IFlightModel>("Flight",flightSchema)