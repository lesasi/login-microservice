import { IEntity } from "../../database/interfaces/entity.interface";

export interface IUser extends IEntity {
  email: string;
  password: string;
  tokens: string[];
}