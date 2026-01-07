import { FilterQuery, Types } from "mongoose";
import { TravelPostModel, ITravelPostDocument } from "../../../framework/database/Models/TravelPostModel";
import {
  ITravelPostRepository,
  PaginatedResult,
  Pagination,
  TravelPostFilter,
} from "../../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPost } from "../../../domain/entities/TravelPostEntity";

const toObjectIdString = (value: Types.ObjectId | undefined): string | undefined =>
  value ? value.toString() : undefined;

const mapDocumentToEntity = (doc: ITravelPostDocument): TravelPost => {
  const authorId = toObjectIdString(doc.authorId as Types.ObjectId);
  const categoryId = toObjectIdString(doc.categoryId as Types.ObjectId);
  const destinationId = toObjectIdString(doc.destinationId as Types.ObjectId | undefined);

  return {
    id: toObjectIdString(doc._id as unknown as Types.ObjectId)!,
    authorId: authorId!,
    title: doc.title,
    slug: doc.slug,
    categoryId: categoryId!,
    destinationId,
    coverImageUrl: doc.coverImageUrl,
    galleryUrls: doc.galleryUrls,
    content: doc.content,
    excerpt: doc.excerpt,
    tags: doc.tags,
    tripDate: doc.tripDate,
    status: doc.status,
    rejectedReason: doc.rejectedReason,
    metrics: {
      views: doc.metrics.views,
      likes: doc.metrics.likes,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export class TravelPostRepository implements ITravelPostRepository {
  async create(post: TravelPost): Promise<TravelPost> {
    const created = await (TravelPostModel as any).create({
      authorId: post.authorId,
      title: post.title,
      slug: post.slug,
      categoryId: post.categoryId,
      destinationId: post.destinationId,
      coverImageUrl: post.coverImageUrl,
      galleryUrls: post.galleryUrls,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags,
      tripDate: post.tripDate,
      status: post.status,
      rejectedReason: post.rejectedReason,
      metrics: post.metrics,
    });

    return mapDocumentToEntity(created);
  }

  async update(post: TravelPost): Promise<TravelPost> {
    if (!post.id) {
      throw new Error("Post id is required for update");
    }

    const updated = await (TravelPostModel as any).findByIdAndUpdate(
      post.id,
      {
        title: post.title,
        categoryId: post.categoryId,
        destinationId: post.destinationId,
        coverImageUrl: post.coverImageUrl,
        galleryUrls: post.galleryUrls,
        content: post.content,
        excerpt: post.excerpt,
        tags: post.tags,
        tripDate: post.tripDate,
        status: post.status,
        rejectedReason: post.rejectedReason,
        metrics: post.metrics,
      },
      { new: true }
    );

    if (!updated) {
      throw new Error("Travel post not found");
    }

    return mapDocumentToEntity(updated);
  }

  async findById(id: string): Promise<TravelPost | null> {
    const doc = await (TravelPostModel as any).findById(id);
    return doc ? mapDocumentToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<TravelPost | null> {
    const doc = await (TravelPostModel as any).findOne({ slug });
    return doc ? mapDocumentToEntity(doc) : null;
  }

  async findByIds(ids: string[]): Promise<TravelPost[]> {
    const objectIds = ids
      .filter((id) => id)
      .map((id) => new Types.ObjectId(id));

    if (!objectIds.length) {
      return [];
    }

    const docs = await (TravelPostModel as any).find({
      _id: { $in: objectIds },
      status: "APPROVED",
    }).sort({ createdAt: -1 });

    return docs.map(mapDocumentToEntity);
  }

  async list(filter: TravelPostFilter, pagination: Pagination): Promise<PaginatedResult<TravelPost>> {
    const query: FilterQuery<ITravelPostDocument> = {};

    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.categoryId) {
      query.categoryId = filter.categoryId;
    }
    if (filter.destinationId) {
      query.destinationId = filter.destinationId;
    }
    if (filter.authorId) {
      query.authorId = filter.authorId;
    }
    if (filter.search) {
      const regex = new RegExp(filter.search, "i");
      query.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [docs, total] = await Promise.all([
      (TravelPostModel as any).find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit),
      (TravelPostModel as any).countDocuments(query),
    ]);

    return {
      data: docs.map(mapDocumentToEntity),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async updateStatus(
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    rejectedReason?: string
  ): Promise<TravelPost | null> {
    const updated = await (TravelPostModel as any).findByIdAndUpdate(
      id,
      {
        status,
        rejectedReason: status === "REJECTED" ? rejectedReason : undefined,
      },
      { new: true }
    );

    return updated ? mapDocumentToEntity(updated) : null;
  }

  async incrementViews(id: string): Promise<void> {
    await (TravelPostModel as any).findByIdAndUpdate(id, {
      $inc: { "metrics.views": 1 },
    });
  }

  async adjustLikes(id: string, delta: number): Promise<void> {
    if (!delta) return;

    await (TravelPostModel as any).findByIdAndUpdate(id, {
      $inc: { "metrics.likes": delta },
    });

    if (delta < 0) {
      await (TravelPostModel as any).findOneAndUpdate(
        { _id: id, "metrics.likes": { $lt: 0 } },
        { $set: { "metrics.likes": 0 } }
      );
    }
  }
}
