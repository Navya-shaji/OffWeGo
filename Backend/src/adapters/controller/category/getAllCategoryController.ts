import { IGetCategoryUsecase } from "../../../domain/interface/category/IGetAllCategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request,Response } from "express";


export class GetAllCategoryController{
    constructor(private getcategory:IGetCategoryUsecase){}

    async getCategories(req:Request,res:Response){
        try {
            const result=await this.getcategory.execute()
            res.status(HttpStatus.OK).json(result)
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to get category"})
        }
    }
}