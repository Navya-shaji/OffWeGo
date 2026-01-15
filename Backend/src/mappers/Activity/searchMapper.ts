import { Activity } from "../../domain/entities/ActivityEntity";
import { ActivityDto } from "../../domain/dto/Package/ActivityDto";

export const mapToActivityDtos = (docs: Activity[]): ActivityDto[] => {
  return docs.map(doc => ({
    id: doc._id?.toString() || doc.activityId || "",
    title: doc.title,
    description: doc.description,
    destinationId: doc.destinationId || "",
    imageUrl: doc.imageUrl || "",
  }));
};
