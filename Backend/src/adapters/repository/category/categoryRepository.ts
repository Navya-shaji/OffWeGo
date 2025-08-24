import { ICategoryRepository } from "../../../domain/interface/category/ICategoryRepository";
import { CategoryModel, ICategoryModel } from "../../../framework/database/Models/categoryModel";
import { CreateCategoryDto } from "../../../domain/dto/admin/CategoryDto";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class CategoryRepository 
  extends BaseRepository<ICategoryModel> 
  implements ICategoryRepository {

  constructor() {
    super(CategoryModel);
  }

  async createCategory(data: CreateCategoryDto): Promise<ICategoryModel> {
    return this.create(data); 
  }

  async getAllCategories(skip: number, limit: number): Promise<ICategoryModel[]> {
    return this.model.find().skip(skip).limit(limit);
  }

  async edit(category: ICategoryModel): Promise<ICategoryModel | null> {
    return this.model.findByIdAndUpdate(category._id, category, { new: true });
  }

  async delete(id: string): Promise<ICategoryModel | null> {
    return super.delete(id); // from BaseRepository
  }

  async countCategory(): Promise<number> {
    return this.model.countDocuments();
  }

  async searchCategory(query: string): Promise<ICategoryModel[]> {
    const regex = new RegExp(query, "i");
    return this.model
      .find({ name: { $regex: regex } })
      .select("name description imageUrl type")
      .limit(10)
      .exec();
  }
}

