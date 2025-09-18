import { ICreateCategoryUsecase } from "../../../domain/interface/Category/IcategoryUsecase";
import { IDeleteCategorynUseCase } from "../../../domain/interface/Category/IDeleteCategory";
import { IEditCategoryUsecase } from "../../../domain/interface/Category/IEditCategoryUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/Category/IGetAllCategoryUsecase";
import { ISearchCategoryUsecase } from "../../../domain/interface/Category/IsearchcategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class CreateCatogoryController {
  constructor(
    private _createcategory: ICreateCategoryUsecase,
    private _getcategory: IGetCategoryUsecase,
    private _editCategory: IEditCategoryUsecase,
    private _deleteCategory: IDeleteCategorynUseCase,
    private _searchcategory: ISearchCategoryUsecase
  ) {}

  async createCategory(req: Request, res: Response) {
    const result = await this._createcategory.execute(req.body);
    res.status(HttpStatus.CREATED).json({ result });
  }

  async getCategories(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this._getcategory.execute(page, limit);

    res.status(HttpStatus.OK).json(result);
  }

  async EditCategory(req: Request, res: Response) {
    const categoryId = req.params.id;
    const categoryData = req.body;
    const result = await this._editCategory.execute(categoryId, categoryData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  }

  async DeleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this._deleteCategory.execute(id);

    return res.status(HttpStatus.OK).json(result);
  }

  async SearchCategory(req: Request, res: Response) {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "The query will be string",
      });
      return;
    }
    const category = await this._searchcategory.execute(query);
    res.status(HttpStatus.OK).json({
      success: true,
      data: category,
    });
  }
}
