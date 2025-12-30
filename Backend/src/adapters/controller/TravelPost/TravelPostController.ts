import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/ICreateTravelPostUsecase";
import { IListTravelPostsUsecase } from "../../../domain/interface/TravelPost/usecases/IListTravelPostsUsecase";
import { IGetTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IGetTravelPostUsecase";
import { IToggleSaveTravelPostUsecase } from "../../../domain/interface/TravelPost/usecases/IToggleSaveTravelPostUsecase";
import { IListSavedTravelPostsUsecase } from "../../../domain/interface/TravelPost/usecases/IListSavedTravelPostsUsecase";
import { GetAllCategories } from "../../../useCases/category/getAllCategoryUsecase";
import { GetAllDestinations } from "../../../useCases/destination/getAllDestinationUsecase";

export class TravelPostController {
  constructor(
    private _createTravelPostUsecase: ICreateTravelPostUsecase,
    private _listTravelPostsUsecase: IListTravelPostsUsecase,
    private _getTravelPostUsecase: IGetTravelPostUsecase,
    private _toggleSaveTravelPostUsecase: IToggleSaveTravelPostUsecase,
    private _listSavedTravelPostsUsecase: IListSavedTravelPostsUsecase,
    private _getAllCategoriesUsecase: GetAllCategories,
    private _getAllDestinationsUsecase: GetAllDestinations
  ) {}

  async createTravelPost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = req.user?.userId || req.user?.id || req.body.authorId;

      if (!authorId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Author information is missing.",
        });
        return;
      }

      const payload = {
        ...req.body,
        authorId,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        tripDate: req.body.tripDate
          ? new Date(req.body.tripDate)
          : undefined,
      };

      const createdPost =
        await this._createTravelPostUsecase.execute(payload);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Travel post submitted for approval.",
        data: createdPost,
      });
    } catch (error) {
      console.error("Error creating travel post:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to create travel post",
      });
    }
  }

  async listTravelPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, categoryId, destinationId, search, status } =
        req.query;

      const parsedPage = page ? Number(page) : undefined;
      const parsedLimit = limit ? Number(limit) : undefined;

      const normalizedStatus =
        typeof status === "string" &&
        ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
          ? (status.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED")
          : "APPROVED";

      const result = await this._listTravelPostsUsecase.execute({
        page: Number.isNaN(parsedPage as number) ? undefined : parsedPage,
        limit: Number.isNaN(parsedLimit as number) ? undefined : parsedLimit,
        categoryId:
          typeof categoryId === "string" && categoryId.trim()
            ? categoryId
            : undefined,
        destinationId:
          typeof destinationId === "string" && destinationId.trim()
            ? destinationId
            : undefined,
        search:
          typeof search === "string" && search.trim() ? search : undefined,
        status: normalizedStatus,
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
        message: (error as Error).message || "Failed to load travel posts",
      });
    }
  }

  async listMyTravelPosts(req: Request, res: Response): Promise<void> {
    try {
      const authorId = req.user?.userId || req.user?.id;

      if (!authorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { page, limit, categoryId, destinationId, search, status } =
        req.query;

      const parsedPage = page ? Number(page) : undefined;
      const parsedLimit = limit ? Number(limit) : undefined;

      const normalizedStatus =
        typeof status === "string" &&
        ["PENDING", "APPROVED", "REJECTED"].includes(status.toUpperCase())
          ? (status.toUpperCase() as "PENDING" | "APPROVED" | "REJECTED")
          : undefined;

      const result = await this._listTravelPostsUsecase.execute({
        page: Number.isNaN(parsedPage as number) ? undefined : parsedPage,
        limit: Number.isNaN(parsedLimit as number) ? undefined : parsedLimit,
        categoryId:
          typeof categoryId === "string" && categoryId.trim()
            ? categoryId
            : undefined,
        destinationId:
          typeof destinationId === "string" && destinationId.trim()
            ? destinationId
            : undefined,
        search:
          typeof search === "string" && search.trim() ? search : undefined,
        status: normalizedStatus,
        authorId,
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
      console.error("Error listing my travel posts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to load travel posts",
      });
    }
  }

  async listTravelPostFilters(req: Request, res: Response): Promise<void> {
    try {
      const [categoryResult, destinationResult] = await Promise.all([
        this._getAllCategoriesUsecase.execute(1, 100),
        this._getAllDestinationsUsecase.execute(1, 100),
      ]);

      const categories = categoryResult?.categories ?? [];
      const destinations = (destinationResult)?.destinations ?? [];

      const totalCategories =
        categoryResult?.totalCategories ?? categories.length;
      const totalDestinations =
        (destinationResult )?.totalDestinations ??
        destinations.length;

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Travel post filters fetched successfully.",
        data: {
          categories,
          destinations,
          totalCategories,
          totalDestinations,
        },
      });
    } catch (error) {
      console.error("Error fetching travel post filters:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          (error as Error).message || "Failed to load travel post filters",
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
      console.error("Error fetching travel post:", error);
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: (error as Error).message || "Failed to load travel post",
      });
    }
  }

  async toggleSaveTravelPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || req.user?.id;
      const { id: postId } = req.params;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const result =
        await this._toggleSaveTravelPostUsecase.execute(userId, postId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.saved ? "Post saved" : "Post unsaved",
        data: result,
      });
    } catch (error) {
      console.error("Error toggling save:", error);
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
          message: "Unauthorized",
        });
        return;
      }

      const posts =
        await this._listSavedTravelPostsUsecase.execute(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Saved travel posts fetched successfully.",
        data: posts,
      });
    } catch (error) {
      console.error("Error listing saved posts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to load saved posts",
      });
    }
  }
}
