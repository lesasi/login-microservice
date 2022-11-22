import { Inject, Injectable } from "@nestjs/common";
import { Filter, MongoClient, Sort } from "mongodb";
import { IEntity } from "../interfaces/entity.interface";
import { MONGO_CONNECTION } from "../utils";

@Injectable()
export abstract class BaseRepository<T extends IEntity> {
  protected abstract collection_name: string;
  
  constructor(
    @Inject(MONGO_CONNECTION) private readonly connection: MongoClient,
  ) {}

  protected getCollection() {
    return this.connection.db().collection(this.collection_name);
  }

  async addOrUpdateEntites(data: T[]): Promise<void> {
    if (!data || data.length === 0) {
      return;
    }
    const querys = data.map((entity) => {
      if(entity) {
        return {
          updateOne: {
            filter: { _id: entity._id },
            update: { $set: { data: entity } },
            upsert: true,
          },
        };
      }
    }).filter(Boolean);
    await this.getCollection().bulkWrite(querys);
  }

  async findAll(
    filter: Filter<T> = {},
    hint?: Record<string, number>,
    sort?: Sort,
  ): Promise<T[]> {
    const docsFind = this.getCollection().find(filter, {
      hint,
      sort,
    });
    const entities = await docsFind.toArray();
    return entities.map((entity) => entity.data);
  }

  async findCount(filter: Filter<T> = {}, isDeleted: 'true' | 'false' | 'any' = 'false'): Promise<number> {
    const number = await this.getCollection().countDocuments(filter);
    return number;
  }

  async deleteMany(filter: Filter<T> = {}) {
    const result = await this.getCollection().deleteMany(filter);
    return result.deletedCount;
  }
}