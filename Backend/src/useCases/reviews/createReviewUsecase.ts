import { CreateReviewDTO } from "../../domain/dto/Review/createReviewDto";
import { ICreateReviewUseCase } from "../../domain/interface/Reviews/IcreateReviewUsecase";
import { IReviewRepository } from "../../domain/interface/Reviews/IReviewRepository";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { mapToSingleReviewEntity } from "../../mappers/Review/mapToCreateReviewDto";

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(
    private _reviewRepo: IReviewRepository,
    private _packageRepo: IPackageRepository,          
    private _notificationService: INotificationService 
  ) {}

  async execute(review: CreateReviewDTO): Promise<CreateReviewDTO> {
    if (review.rating < 1 || review.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if this user has already reviewed this package
    const existingReview = await this._reviewRepo.findByPackageAndUser(review.packageName, review.userId);
    if (existingReview) {
      throw new Error("You have already submitted a review for this package");
    }

    const createdReview = await this._reviewRepo.create(review);

    const packageData = await this._packageRepo.findOne({ packageName: review.packageName });
    if (!packageData) throw new Error("Package not found");

    const vendorId = packageData.vendorId;
    if (!vendorId) throw new Error("Vendor not found");

    await this._notificationService.send({
      recipientId: vendorId.toString(),
      recipientType: "vendor",
      title: "New Review Received",
      message: `Your package "${packageData.packageName}" has received a new review with ${review.rating} star(s).`,
      createdAt: new Date(),
      read:false
    });

    return mapToSingleReviewEntity(createdReview);
  }
}
