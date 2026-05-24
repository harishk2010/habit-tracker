import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface IGenericRepository<T extends Document> {
  create(payload: Partial<T>): Promise<T>;
  findById(id: string, select?: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>, select?: string): Promise<T | null>;
  findAll(filter?: FilterQuery<T>, select?: string): Promise<T[]>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  deleteMany(filter: FilterQuery<T>): Promise<void>;
  count(filter?: FilterQuery<T>): Promise<number>;
  exists(filter: FilterQuery<T>): Promise<boolean>;
}

export class GenericRepository<T extends Document> implements IGenericRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(payload: Partial<T>): Promise<T> {
    return await this.model.create(payload);
  }

  async findById(id: string, select?: string): Promise<T | null> {
    const query = this.model.findById(id);
    if (select) query.select(select);
    return await query.exec();
  }

  async findOne(filter: FilterQuery<T>, select?: string): Promise<T | null> {
    const query = this.model.findOne(filter);
    if (select) query.select(select);
    return await query.exec();
  }

  async findAll(filter: FilterQuery<T> = {}, select?: string): Promise<T[]> {
    const query = this.model.find(filter);
    if (select) query.select(select);
    return await query.lean().exec() as unknown as T[];
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteMany(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteMany(filter);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.findOne(filter).select('_id').lean();
    return !!doc;
  }
}
