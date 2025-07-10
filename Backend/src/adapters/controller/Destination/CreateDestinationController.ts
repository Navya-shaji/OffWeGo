import {Request,Response} from "express"
import { CreateDestination } from "../../../useCases/Destination/createDestinationUsecase"
import { HttpStatus } from "../../../domain/statusCode/statuscode"

export class CreateDestinationController{
    constructor(private createDestination :CreateDestination){}
    async addDestination(req:Request,res:Response){
        try {
            const result=await this.createDestination.execute(req.body)
            res.status(HttpStatus.CREATED).json({result})

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to create Destinations"})
        }
    }
}