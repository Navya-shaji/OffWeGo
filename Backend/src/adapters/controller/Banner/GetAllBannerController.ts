import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request,Response } from "express";

export class GetAllBannerController{
    constructor(private getbannerUsecase:IGetBannerUsecase){}

    async getBanners(req:Request,res:Response){
        try {
            const result=await this.getbannerUsecase.execute()
            res.status(HttpStatus.OK).json(result)
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Failed to get the banner"})
        }
    }
}