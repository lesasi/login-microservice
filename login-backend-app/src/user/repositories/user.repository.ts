import { Injectable } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { BaseRepository } from "../../database/repositories/mongo-base.respository";
import { UserDto } from "../dtos/user.dto";
import { IUser } from "../interfaces/user.interface";

@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  protected collection_name: string = 'users';

  getClass(): (data: IUser) => ClassConstructor<IUser> {
    return () => UserDto;
  }

  getTableIndexes(): Record<string, number>[] {
    return [
      { email: 1 }
    ];
  }

}