import { Model } from 'mongoose';
import { IBaseRepo } from '../../../domain/interface/BaseRepo/IBaseRepo';

export abstract class BaseRepository<T> implements IBaseRepo<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: T): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject() as T;
  }

  async findAll(): Promise<T[]> {
    const result = await this.model.find().lean().exec();
    return result as T[];
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc as T | null;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    }).lean().exec();
    return updated as T | null;
  }

  async delete(id: string): Promise<T | null> {
    const deleted = await this.model.findByIdAndDelete(id).lean().exec();
    return deleted as T | null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const found = await this.model.findOne(filter).lean().exec();
    return found as T | null;
  }
}
