import { ICreateCategoryUsecase } from "../../../domain/interface/category/IcategoryUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/category/IGetAllCategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class CreateCatogoryController {
  constructor(private createcategory: ICreateCategoryUsecase ,private getcategory:IGetCategoryUsecase) {}

  async createCategory(req: Request, res: Response) {
    try {
      const result = await this.createcategory.execute(req.body);
      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      console.error("Error in CreateCategoryController:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create Catogory" });
    }
  }

      async getCategories(req:Request,res:Response){
        try {
            const result=await this.getcategory.execute()
            res.status(HttpStatus.OK).json(result)
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to get category"})
        }
    }
}
