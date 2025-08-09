import { ICreateCategoryUsecase } from "../../../domain/interface/category/IcategoryUsecase";
import { IDeleteCategorynUseCase } from "../../../domain/interface/category/IDeleteCategory";
import { IEditCategoryUsecase } from "../../../domain/interface/category/IEditCategoryUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/category/IGetAllCategoryUsecase";
import { ISearchCategoryUsecase } from "../../../domain/interface/category/IsearchcategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class CreateCatogoryController {
  constructor(
    private _createcategory: ICreateCategoryUsecase,
    private _getcategory: IGetCategoryUsecase,
    private _editCategory: IEditCategoryUsecase,
    private _deleteCategory: IDeleteCategorynUseCase,
    private _searchcategory:ISearchCategoryUsecase
  ) {}

  async createCategory(req: Request, res: Response) {
    try {
      const result = await this._createcategory.execute(req.body);
      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      console.error("Error in CreateCategoryController:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create Catogory" });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this._getcategory.execute(page, limit);
      
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get category" });
    }
  }

  async EditCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      const result = await this._editCategory.execute(categoryId, categoryData);
    
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Category updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update Category",
      });
    }
  }

  async DeleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._deleteCategory.execute(id);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete Category" });
    }
  }

  async SearchCategory(req:Request,res:Response){
    try {
      const query=req.query.q
      if(typeof query!=='string' || !query.trim()){
        res.status(HttpStatus.BAD_REQUEST).json({
          message:"The query will be string"
        })
        return 
      }
      const category=await this._searchcategory.execute(query)
         res.status(HttpStatus.OK).json({
        success:true,
        data:category
      })
    } catch (error) {
       res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
