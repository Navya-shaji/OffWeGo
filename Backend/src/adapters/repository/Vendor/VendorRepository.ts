import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { Vendor } from "../../../domain/entities/VendorEntities";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import {
  VendorModel,
  IVendorModel,
} from "../../../framework/database/Models/vendorModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class VendorRepository
  extends BaseRepository<IVendorModel>
  implements IVendorRepository
{
  constructor() {
    super(VendorModel);
  }

  async createVendor(
    data: RegistervendorDto
  ): Promise<IVendorModel> {
    return this.model.create(data);
  }

  async findByEmail(
    email: string
  ): Promise<IVendorModel | null> {
    return this.model
      .findOne({
        email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
      })
      .exec();
  }

  async findByPhone(
    phone: string
  ): Promise<IVendorModel | null> {
    return this.model.findOne({ phone }).exec();
  }

  async findById(
    id: string
  ): Promise<IVendorModel | null> {
    return super.findById(id);
  }

  async updateVendorStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<IVendorModel | null> {
    return this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async updateVendorStatusByEmail(
    email: string,
    status: "approved" | "rejected"
  ): Promise<IVendorModel | null> {
    return this.model
      .findOneAndUpdate(
        { email },
        { $set: { status } },
        { new: true }
      )
      .exec();
  }

  async findPendingVendors(): Promise<IVendorModel[]> {
    return this.model.find({ status: "pending" }).exec();
  }

  async approveVendor(
    id: string
  ): Promise<IVendorModel | null> {
    return this.model
      .findByIdAndUpdate(id, { status: "approved" }, { new: true })
      .exec();
  }

  async rejectVendor(
    id: string
  ): Promise<IVendorModel | null> {
    return this.model
      .findByIdAndUpdate(id, { status: "rejected" }, { new: true })
      .exec();
  }

  async updateLastLogin(
    id: string,
    date: Date
  ): Promise<void> {
    await this.model
      .findByIdAndUpdate(id, { lastLogin: date })
      .exec();
  }

  async findByStatus(
    status: string
  ): Promise<IVendorModel[]> {
    return this.model.find({ status }).exec();
  }

  async getAllVendors(
    skip: number,
    limit: number,
    filter: Record<string, unknown> = {}
  ): Promise<IVendorModel[]> {
    return this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async updateVendorStatusByAdmin(
    vendorId: string,
    status: "blocked" | "unblocked"
  ): Promise<void> {
    const vendor = await this.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    vendor.isBlocked = status === "blocked";
    await vendor.save();
  }

  async getProfileByEmail(
    email: string
  ): Promise<RegistervendorDto | null> {
    return this.model.findOne({ email }).exec();
  }

  async countVendors(
    filter: Record<string, unknown> = {}
  ): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async searchVendor(
    query: string
  ): Promise<Vendor[]> {
    const regex = new RegExp(query, "i");

    const vendors = await this.model
      .find({ name: { $regex: regex } })
      .select("name email _id phone documentUrl status createdAt")
      .limit(10)
      .lean<Vendor[]>()
      .exec();

    return vendors.map((v) => ({
      ...v,
      _id: v._id.toString(),
    }));
  }

  async findAll(): Promise<IVendorModel[]> {
    return this.model.find({}).exec();
  }

  async updateFcmToken(
    id: string,
    token: string
  ): Promise<IVendorModel | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { fcmToken: token },
        { new: true }
      )
      .exec();
  }

  async getFcmTokenById(
    vendorId: string
  ): Promise<string | null> {
    const vendor = await this.model
      .findById(vendorId)
      .select("fcmToken")
      .exec();

    return vendor?.fcmToken ?? null;
  }
}
