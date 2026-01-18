/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Types } from "mongoose";
import { TravelPostModel, ITravelPostDocument } from "../../../framework/database/Models/TravelPostModel";
import {
  ITravelPostRepository,
  PaginatedResult,
  Pagination,
  TravelPostFilter,
} from "../../../domain/interface/TravelPost/ITravelPostRepository";
import { TravelPost } from "../../../domain/entities/TravelPostEntity";



const mapDocumentToEntity = (doc: ITravelPostDocument): TravelPost => {
  // Handle populated or unpopulated authorId
  let authorId: string;
  let authorName: string | undefined;
  let authorProfilePicture: string | undefined;

  const authorData = doc.authorId as any;
  if (authorData && typeof authorData === "object" && "_id" in authorData) {
    authorId = authorData._id.toString();
    authorName = authorData.name;
    authorProfilePicture = authorData.imageUrl;
  } else {
    authorId = doc.authorId ? doc.authorId.toString() : "";
  }

  // Handle populated or unpopulated categoryId
  let categoryId: string;
  let categoryName: string | undefined;
  const categoryData = doc.categoryId as any;
  if (categoryData && typeof categoryData === "object" && "_id" in categoryData) {
    categoryId = categoryData._id.toString();
    categoryName = categoryData.name;
  } else {
    categoryId = doc.categoryId ? doc.categoryId.toString() : "";
  }

  // Handle populated or unpopulated destinationId
  let destinationId: string | undefined;
  let destinationName: string | undefined;
  const destinationData = doc.destinationId as any;
  if (destinationData && typeof destinationData === "object" && "_id" in destinationData) {
    destinationId = destinationData._id.toString();
    destinationName = destinationData.name;
  } else {
    destinationId = doc.destinationId ? doc.destinationId.toString() : undefined;
  }

  return {
    id: doc._id.toString(),
    authorId,
    authorName,
    authorProfilePicture,
    title: doc.title,
    slug: doc.slug,
    categoryId,
    categoryName,
    destinationId,
    destinationName,
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
    viewedBy: (doc.viewedBy || []).map(id => id.toString()),
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
    const doc = await (TravelPostModel as any)
      .findById(id)
      .populate("authorId")
      .populate("categoryId")
      .populate("destinationId");
    return doc ? mapDocumentToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<TravelPost | null> {
    const trimmedSlug = (slug || "").trim().toLowerCase();
    if (!trimmedSlug) return null;
    const doc = await (TravelPostModel as any)
      .findOne({ slug: trimmedSlug })
      .populate("authorId")
      .populate("categoryId")
      .populate("destinationId");
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
    })
      .populate("authorId")
      .populate("categoryId")
      .populate("destinationId")
      .sort({ createdAt: -1 });

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

    let sortQuery: any = { createdAt: -1 };
    if (filter.sortBy === "oldest") {
      sortQuery = { createdAt: 1 };
    } else if (filter.sortBy === "popular") {
      sortQuery = { "metrics.views": -1 };
    }

    const [docs, total] = await Promise.all([
      (TravelPostModel as any).find(query)
        .populate("authorId")
        .populate("categoryId")
        .populate("destinationId")
        .sort(sortQuery)
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

  async incrementViews(id: string, requesterId?: string): Promise<void> {
    if (!requesterId) {
      // We no longer increment views for guest users
      return;
    }

    // For logged-in users, we only increment if they haven't viewed it yet
    await (TravelPostModel as any).findOneAndUpdate(
      {
        _id: id,
        viewedBy: { $ne: new Types.ObjectId(requesterId) }
      },
      {
        $inc: { "metrics.views": 1 },
        $addToSet: { viewedBy: new Types.ObjectId(requesterId) }
      },
      { new: true }
    );
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
