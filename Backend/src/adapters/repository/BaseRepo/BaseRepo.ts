import { Document, Model } from "mongoose";
import { IBaseRepo } from "../../../domain/interface/BaseRepo/IBaseRepo";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepo<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await (this.model).create(data);
  }

  async findAll(): Promise<T[]> {
    return (this.model).find();
  }

  async findById(id: string): Promise<T | null> {
    return (this.model ).findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return (this.model).findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return (this.model).findByIdAndDelete(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return (this.model).findOne(filter as Record<string, unknown>);
  }
}
