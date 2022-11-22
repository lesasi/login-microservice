import { Inject, Injectable } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
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

  abstract getClass(): (data: T) => ClassConstructor<T>;

  async validateEntity(entity: T) {
    const errors = await validate(plainToInstance(this.getClass()(entity), entity));
    // Do something to deal with the errors later
    return errors;
  }

  async findEntities(
    filter: Filter<T> = {},
    customHint?: Record<string, number>,
    customSort?: Sort,
  ): Promise<T[]> {
    const docsFind = this.getCollection().find<T>(filter, {
      hint: customHint,
      sort: customSort,
    });
    const entities = await docsFind.toArray();
    return entities;
  }

  async addOrUpdateEntities(entities: T[], ignoreValidation = false): Promise<void> {
    if (!entities || entities.length === 0) {
      return;
    }
    if(!ignoreValidation) {
      await Promise.all(entities.map(async (e) => await this.validateEntity(e)));
    }
    const querys = entities.map((entity) => {
      if(entity) {
        return {
          updateOne: {
            filter: { _id: entity._id },
            update: { $set: entity },
            upsert: true,
          },
        };
      }
    }).filter(Boolean);
    await this.getCollection().bulkWrite(querys);
  }

  async findCount(filter: Filter<T> = {}): Promise<number> {
    const number = await this.getCollection().countDocuments(filter);
    return number;
  }

  async deleteMany(filter: Filter<T> = {}) {
    const result = await this.getCollection().deleteMany(filter);
    return result.deletedCount;
  }
}