import { ICreateCategoryUsecase } from "../../../domain/interface/category/IcategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import {Request,Response} from "express"

export class CreateCatogoryController{
    constructor(private createcategory:ICreateCategoryUsecase){}

    async createCategory(req:Request,res:Response){
        try {
            console.log("haiii")
             console.log("Incoming:", req.body); 
            const result=await this.createcategory.execute(req.body)
            console.log(result)
            res.status(HttpStatus.CREATED).json({result})
        } catch (error) {
             console.error("Error in CreateCategoryController:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to create Catogory"})
        }
    }
}