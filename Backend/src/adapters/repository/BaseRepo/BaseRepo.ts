import { Document, Model } from "mongoose";
import { IBaseRepo } from "../../../domain/interface/BaseRepo/IBaseRepo";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepo<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await (this.model as any).create(data);
  }

  async findAll(): Promise<T[]> {
    return (this.model as any).find();
  }

  async findById(id: string): Promise<T | null> {
    return (this.model as any).findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return (this.model as any).findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return (this.model as any).findByIdAndDelete(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return (this.model as any).findOne(filter as Record<string, unknown>);
  }
}
