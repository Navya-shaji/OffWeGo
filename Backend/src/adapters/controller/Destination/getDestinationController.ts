import { Request,Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetAllDestinations } from "../../../domain/interface/destination/IGetAllDestinations";


export class GetAllDestinationController{
    constructor(private getDestination:IGetAllDestinations){}
    async getAllDestination(req:Request,res:Response){
        try{
            const result =await this.getDestination.execute()
            res.status(HttpStatus.OK).json(result)
        }catch(error){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to get Destinations"})
        }
    }
}