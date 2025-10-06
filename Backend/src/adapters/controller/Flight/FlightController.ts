import { ICreateFlightUsecase } from "../../../domain/interface/Flight/ICreateFlightUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";


export class FlightController{
    constructor(
        private _createFlight:ICreateFlightUsecase
    ){}

    async addFlightDetails(req:Request,res:Response){
        const result=await this._createFlight.execute(req.body);
        res.status(HttpStatus.CREATED).json({result})
    }
}