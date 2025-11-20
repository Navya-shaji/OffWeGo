import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/Admin/CategoryDto";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";
import { CategoryDto } from "../../domain/dto/category/categoryDto";
import { INotificationService } from "../../domain/interface/Notification/INotificationService";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";
import { Role } from "../../domain/constants/Roles";

export class CreateCategory {
  constructor(
    private _categoryRepo: ICategoryRepository,
    private _notificationService: INotificationService,
    private _vendorRepo: IVendorRepository
  ) {}

  async execute(data: CreateCategoryDto): Promise<CategoryDto> {
    const existingCategory = await this._categoryRepo.findByName(data.name);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const created = await this._categoryRepo.createCategory(data);

   
    const vendors = await this._vendorRepo.findByStatus("approved");
    const fcmTokens = vendors
      .map(v => v.fcmToken)
      .filter(token => token); 

if (fcmTokens.length) {
  await this._notificationService.send({
    tokens: fcmTokens,
    title: "New Category Added",
    body: `A new category "${data.name}" has been added.`,
    recipientType:Role.VENDOR
  });
}


    return mapToCatrgoryDto(created);
  }
}

