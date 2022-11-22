import { IsEmail, IsString } from "class-validator";
import { IUser } from "../interfaces/user.interface";

export class UserDto implements IUser {
  _id: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;

  @IsString({ each: true })
  tokens: string[];
}