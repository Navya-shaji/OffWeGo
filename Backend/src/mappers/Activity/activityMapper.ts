import { IActivityModel } from "../../framework/database/Models/ActivityModel";
import { ActivityDto } from "../../domain/dto/Package/ActivityDto";

export const mapToActivityDto = (doc: IActivityModel): ActivityDto => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  destinationId: doc.destinationId,
  imageUrl: doc.imageUrl,
});
