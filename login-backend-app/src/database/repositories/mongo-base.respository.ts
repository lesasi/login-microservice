import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Filter, MongoClient, Sort } from "mongodb";
import { IValidationMessage, transformErrorMessages } from "../../utils";
import { IEntity } from "../interfaces/entity.interface";
import { MONGO_CONNECTION } from "../utils";

@Injectable()
export abstract class BaseRepository<T extends IEntity> implements OnModuleInit {
  protected abstract collection_name: string;
  
  constructor(
    @Inject(MONGO_CONNECTION) private readonly connection: MongoClient,
  ) {}

  protected getCollection() {
    return this.connection.db().collection(this.collection_name);
  }

  async onModuleInit() {
    const indexes = this.getTableIndexes();
    await Promise.all(
      indexes.map(async (index) => {
        await this.getCollection().createIndex(index);
      }),
    );
  }

  // Return array of indexes to open on table
  abstract getTableIndexes(): Record<string, number>[];

  abstract getClass(): (data: T) => ClassConstructor<T>;

  async validateEntity(entity: T) {
    const errors = await validate(plainToInstance(this.getClass()(entity), entity));
    const transformedErrorMessages = transformErrorMessages(errors);
    // Do something to deal with the errors later
    return transformedErrorMessages;
  }

  async findOne(
    filter: Filter<T> = {},
    customHint?: Record<string, number>,
    customSort?: Sort,
  ) {
    const entities = await this.findEntities(filter, customSort, customHint);
    return entities && entities.length > 0 ? entities[0]: null;
  }

  async findEntities(
    filter: Filter<T> = {},
    customSort?: Sort,
    customHint?: Record<string, number>,
  ): Promise<T[]> {
    const docsFind = this.getCollection().find<T>(filter, {
      hint: customHint,
      sort: customSort,
    });
    const entities = await docsFind.toArray();
    return entities;
  }

  async addOrUpdateEntity(entity: T, ignoreValidation: boolean = false): Promise<void | IValidationMessage[]> {
    await this.addOrUpdateEntities([entity], ignoreValidation);
  }

  async addOrUpdateEntities(entities: T[], ignoreValidation = false): Promise<void| IValidationMessage[]> {
    if (!entities || entities.length === 0) {
      return;
    }
    if(!ignoreValidation) {
      const errors = (await Promise.all(entities.map(async (e) => await this.validateEntity(e))))?.flat();
      if(errors && errors.length > 0) {
        console.error('Error in saving ', entities, errors)
        return errors;
      }
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