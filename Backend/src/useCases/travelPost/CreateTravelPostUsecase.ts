import { ICreateTravelPostUsecase } from "../../domain/interface/TravelPost/usecases/ICreateTravelPostUsecase";
import { TravelPostDto } from "../../domain/dto/TravelPost/TravelPostDto";
import { ITravelPostRepository } from "../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPost } from "../../domain/entities/TravelPostEntity";
import { CreateTravelPostDto } from "../../domain/dto/TravelPost/CreateTravelDto";
import { mapTravelPostToDto } from "../../mappers/TravelPost/mapTravelPostToDto";


const slugify = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const createExcerpt = (content: string, fallback?: string): string => {
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim();
  }
  return content.replace(/<[^>]+>/g, "").slice(0, 180).trim() + "...";
};

export class CreateTravelPostUsecase implements ICreateTravelPostUsecase {
  constructor(private readonly travelPostRepository: ITravelPostRepository) {}

  async execute(payload: CreateTravelPostDto): Promise<TravelPostDto> {
    if (!payload.authorId) {
      throw new Error("Author id is required");
    }
    if (!payload.title?.trim()) {
      throw new Error("Title is required");
    }
    if (!payload.categoryId) {
      throw new Error("Category id is required");
    }
    if (!payload.content?.trim()) {
      throw new Error("Content is required");
    }

    const slugBase = slugify(payload.title);
    const timestamp = Date.now();
    const slug = `${slugBase}-${timestamp}`;

    const post: TravelPost = {
      authorId: payload.authorId,
      title: payload.title.trim(),
      slug,
      categoryId: payload.categoryId,
      destinationId: payload.destinationId,
      coverImageUrl: payload.coverImageUrl,
      galleryUrls: payload.galleryUrls ?? [],
      content: payload.content,
      excerpt: createExcerpt(payload.content, payload.excerpt),
      tags: payload.tags ?? [],
      tripDate: payload.tripDate,
      status: "PENDING",
      metrics: {
        views: 0,
        likes: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.travelPostRepository.create(post);

    return mapTravelPostToDto(created);
  }
}
