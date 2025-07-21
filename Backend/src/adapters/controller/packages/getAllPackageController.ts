import { IGetPackageUsecase } from "../../../domain/interface/vendor/IGetPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request,Response } from "express";

export class GetAllPackageController{
    constructor(private getPackage:IGetPackageUsecase){}
    async getAllPackage(req:Request,res:Response){
        try {
            const result=await this.getPackage.execute()
            res.status(HttpStatus.OK).json(result)
        } catch (error) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to get Destinations"})

        }
    }
}