import { IDeleteFlightUsecase } from "../../domain/interface/Flight/IDeleteFlightUsecase";
import { IFlightRepository } from "../../domain/interface/Flight/IFlightRepository";

export class DeleteFlightUsecase implements IDeleteFlightUsecase{
    constructor(private _flightRepo:IFlightRepository){}

    async execute(id: string): Promise<{ success: boolean; messege: string; }> {
        const result=await this._flightRepo.deleteFlight(id)
        if(!result){
            throw new Error("Flight Not Found")
        }
        return {success:true,messege:"Flight Deleted Successfully"}
    }
}