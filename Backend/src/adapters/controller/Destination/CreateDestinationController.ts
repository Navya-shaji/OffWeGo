import {Request,Response} from "express"
import { HttpStatus } from "../../../domain/statusCode/statuscode"
import { ICreateDestinationUsecase } from "../../../domain/interface/destination/ICreateDestinationUsecase"

export class CreateDestinationController{
    constructor(private createDestination :ICreateDestinationUsecase){}
    async addDestination(req:Request,res:Response){
        try {
            const result=await this.createDestination.execute(req.body)
            res.status(HttpStatus.CREATED).json({result})

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to create Destinations"})
        }
    }
}