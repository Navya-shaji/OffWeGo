import { ICreateCategoryUsecase } from "../../../domain/interface/Category/IcategoryUsecase";
import { IDeleteCategorynUseCase } from "../../../domain/interface/Category/IDeleteCategory";
import { IEditCategoryUsecase } from "../../../domain/interface/Category/IEditCategoryUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/Category/IGetAllCategoryUsecase";
import { ISearchCategoryUsecase } from "../../../domain/interface/Category/IsearchcategoryUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class CreateCategoryController {
  constructor(
    private _createCategoryUsecase: ICreateCategoryUsecase,
    private _getCategoryUsecase: IGetCategoryUsecase,
    private _editCategoryUsecase: IEditCategoryUsecase,
    private _deleteCategoryUsecase: IDeleteCategorynUseCase,
    private _searchCategoryUsecase: ISearchCategoryUsecase
  ) {}

  async createCategory(req: Request, res: Response) {
    try {
      const result = await this._createCategoryUsecase.execute(req.body);
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this._getCategoryUsecase.execute(page, limit);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async EditCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      const result = await this._editCategoryUsecase.execute(
        categoryId,
        categoryData
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Category updated successfully",
        data: result,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async DeleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deleteCategoryUsecase.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }

  async SearchCategory(req: Request, res: Response) {
    try {
      const query = req.query.q;
      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "The query must be a non-empty string",
        });
        return;
      }
      const category = await this._searchCategoryUsecase.execute(query);
      res.status(HttpStatus.OK).json({ success: true, data: category });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error });
    }
  }
}
