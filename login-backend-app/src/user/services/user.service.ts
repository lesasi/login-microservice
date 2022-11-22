import { Injectable, OnModuleInit } from "@nestjs/common";
import { IUser } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ){}

  async createUser(email: string, password: string) {
    const user: IUser = {
      _id: uuid(),
      email,
      password,
      tokens: []
    };
    await this.userRepository.addOrUpdateEntity(user);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findEntities({ email });
  }
}