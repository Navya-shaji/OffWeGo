import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";
export class CreateBannercontroller{
    constructor(private createBanner:IBannerCreateUsecase){}

    async CreateBanner(req:Request,res:Response){
        try {
            const result=await this.createBanner.execute(req.body)
            res.status(HttpStatus.OK).json({result})
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to create banner"})
        }
    }
}