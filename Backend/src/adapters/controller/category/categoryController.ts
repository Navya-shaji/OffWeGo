import { ICreateCategoryUsecase } from "../../../domain/interface/category/IcategoryUsecase";
import { IDeleteCategorynUseCase } from "../../../domain/interface/category/IDeleteCategory";
import { IEditCategoryUsecase } from "../../../domain/interface/category/IEditCategoryUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/category/IGetAllCategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class CreateCatogoryController {
  constructor(
    private createcategory: ICreateCategoryUsecase,
    private getcategory: IGetCategoryUsecase,
    private editCategory: IEditCategoryUsecase,
    private deleteCategory: IDeleteCategorynUseCase
  ) {}

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

  async getCategories(req: Request, res: Response) {
    try {
      const page=parseInt(req.query.page as string)||1
      const limit=parseInt(req.query.limit as string)||10
      const result = await this.getcategory.execute(page,limit);
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
      const result = await this.editCategory.execute(categoryId, categoryData);

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

      const result = await this.deleteCategory.execute(id);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete Category" });
    }
  }
}
