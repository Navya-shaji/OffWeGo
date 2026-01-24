import { ICategoryRepository } from "../../domain/interface/Category/ICategoryRepository";
import { CreateCategoryDto } from "../../domain/dto/Admin/CategoryDto";
import { mapToCatrgoryDto } from "../../mappers/Category/categoryMappers";
import { CategoryDto } from "../../domain/dto/Category/CategoryDto";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { Role } from "../../domain/constants/Roles";

export class CreateCategory {
  constructor(
    private _categoryRepo: ICategoryRepository,
    private _vendorRepo: IVendorRepository,
    private _notificationservice: INotificationService

  ) { }

  async execute(data: CreateCategoryDto): Promise<CategoryDto> {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Category name cannot be empty");
    }

    const existingCategory = await this._categoryRepo.findByName(data.name);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const created = await this._categoryRepo.createCategory(data);
console.log(created,"log created category")
    const vendors = await this._vendorRepo.findByStatus("approved");
    console.log(vendors,"vendors")


    for (const vendor of vendors) {
      await this._notificationservice.send({
        recipientId: vendor._id.toString(),
        recipientType: Role.VENDOR,
        title: "New Category Added",
        message: `A new category "${data.name}" has been added.`,
        read: false
      });
    }

    return mapToCatrgoryDto(created);
  }

}

