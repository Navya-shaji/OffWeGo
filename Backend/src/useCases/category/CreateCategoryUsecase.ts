import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/Admin/CategoryDto";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";
import { CategoryDto } from "../../domain/dto/category/categoryDto";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";

export class CreateCategory {
  constructor(
    private _categoryRepo: ICategoryRepository,
    private _vendorRepo:IVendorRepository,
    private _notificationservice:INotificationService
  
  ) {}

async execute(data: CreateCategoryDto): Promise<CategoryDto> {
  const existingCategory = await this._categoryRepo.findByName(data.name);
  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const created = await this._categoryRepo.createCategory(data);

  const vendors = await this._vendorRepo.findByStatus("approved");

  
  for (const vendor of vendors) {
    await this._notificationservice.send({
      recipientId: vendor._id.toString(),
      recipientType: "vendor",
      title: "New Category Added",
      message: `A new category "${data.name}" has been added.`,
    });
  }

  return mapToCatrgoryDto(created);
}

}

