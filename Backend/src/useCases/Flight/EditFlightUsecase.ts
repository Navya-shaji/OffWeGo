import { FlightDto } from "../../domain/dto/Flight/FlightDto";
import { IEditFlightUsecase } from "../../domain/interface/Flight/IEditFlightUSecase";
import { IFlightRepository } from "../../domain/interface/Flight/IFlightRepository";
import { mapToFlightDto } from "../../mappers/Flight/mapToFlight";

export class EditFlightUsecase implements IEditFlightUsecase{
    constructor(private _flightRepo:IFlightRepository){}
    async execute(id: string, updatedData: FlightDto): Promise<FlightDto | null> {
        const updatedDoc=await this._flightRepo.updateFlight(id,updatedData)
        return updatedDoc?mapToFlightDto(updatedDoc):null
    }
}