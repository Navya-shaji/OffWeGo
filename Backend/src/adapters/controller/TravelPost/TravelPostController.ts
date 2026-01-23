import { Request, Response } from "express";
import { ICreateTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/ICreateTravelPostUsecase";
import { IListTravelPostsUsecase } from "../../../domain/interface/TravelPost/usecases/IListTravelPostsUsecase";
import { IGetTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IGetTravelPostUsecase";
import { IToggleSaveTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IToggleSaveTravelPostUsecase";
import { IListSavedTravelPostsUsecase } from "../../../domain/interface/TravelPost/usecases/IListSavedTravelPostsUsecase";
import { IGetCategoryUsecase } from "../../../domain/interface/Category/IGetAllCategoryUsecase";
import { IGetAllDestinations } from "../../../domain/interface/Destination/IGetAllDestinations";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { SortOption } from "../../../domain/interface/TravelPost/ITravelPostRepository";

export class TravelPostController {
  constructor(
    private _createTravelPostUsecase: ICreateTravelPostUsecase,
    private _listTravelPostsUsecase: IListTravelPostsUsecase,
    private _getTravelPostUsecase: IGetTravelPostUsecase,
    private _toggleSaveTravelPostUsecase: IToggleSaveTravelPostUsecase,
    private _listSavedTravelPostsUsecase: IListSavedTravelPostsUsecase,
    private _listCategoriesUsecase: IGetCategoryUsecase,
    private _listDestinationsUsecase: IGetAllDestinations
  ) { }

  async createTravelPost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = req.user?.userId || req.user?.id;
      if (!authorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const post = await this._createTravelPostUsecase.execute({
        ...req.body,
        authorId,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Travel story submitted successfully and is pending approval.",
        data: post,
      });
    } catch (error) {
      console.error("Error creating travel post:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Failed to create travel post",
      });
    }
  }

  async listTravelPosts(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        categoryId,
        destinationId,
        authorId,
        search,
        sortBy,
        page,
        limit,
      } = req.query;

      const requesterId = req.user?.userId || req.user?.id || undefined;

      const result = await this._listTravelPostsUsecase.execute({
        status: (status as "PENDING" | "APPROVED" | "REJECTED") || "APPROVED",
        categoryId: categoryId as string,
        destinationId: destinationId as string,
        authorId: authorId as string,
        search: search as string,
        sortBy: sortBy as SortOption,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        requesterId,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Travel stories fetched successfully.",
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      console.error("Error listing travel posts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch travel stories",
      });
    }
  }

  async listMyTravelPosts(req: Request, res: Response): Promise<void> {
    try {
      const authorId = req.user?.userId || req.user?.id;
      const { status, categoryId, destinationId, search, sortBy, page, limit } =
        req.query;

      if (!authorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const result = await this._listTravelPostsUsecase.execute({
        authorId,
        status: status as "PENDING" | "APPROVED" | "REJECTED",
        categoryId: categoryId as string,
        destinationId: destinationId as string,
        search: search as string,
        sortBy: sortBy as SortOption,
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        requesterId: authorId,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "My travel stories fetched successfully.",
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      console.error("Error listing user travel posts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch your travel stories",
      });
    }
  }

  async getTravelPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const requesterId = req.user?.userId || req.user?.id || null;

      if (!slug) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Post slug is required.",
        });
        return;
      }

      const post = await this._getTravelPostUsecase.execute(
        { slug },
        requesterId
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Travel post fetched successfully.",
        data: post,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: (error as Error).message || "Failed to load travel post",
      });
    }
  }

  async toggleSaveTravelPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || req.user?.id;
      const { postId } = req.params;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const result = await this._toggleSaveTravelPostUsecase.execute(userId, postId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.saved ? "Story saved successfully" : "Story removed from saved",
        data: result,
      });
    } catch (error) {
      console.error("Error toggling travel post save:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Failed to toggle save",
      });
    }
  }

  async listSavedTravelPosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const posts = await this._listSavedTravelPostsUsecase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Saved travel stories fetched successfully.",
        data: posts,
      });
    } catch (error) {
      console.error("Error listing saved travel posts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch saved travel stories",
      });
    }
  }

  async listTravelPostFilters(req: Request, res: Response): Promise<void> {
    try {
      const [categoriesResult, destinationsResult] = await Promise.all([
        this._listCategoriesUsecase.execute(1, 100),
        this._listDestinationsUsecase.execute(1, 100),
      ]);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          categories: categoriesResult.categories,
          destinations: destinationsResult.destinations,
        },
      });
    } catch (error) {
      console.error("Error listing travel post filters:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch filters",
      });
    }
  }
}
