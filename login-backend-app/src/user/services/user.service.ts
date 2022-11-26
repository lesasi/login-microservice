import { Injectable, OnModuleInit } from "@nestjs/common";
import { IUser } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ){}

  async createUserWithEmailAndPassword(email: string, password: string) {
    const user: IUser = {
      _id: uuid(),
      email,
      password,
      tokens: []
    };
    await this.userRepository.addOrUpdateEntity(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOne({ email });
  }

  async saveTokenToUser(user: IUser, token: string) {
    const newUser: IUser = {
      ...user,
      tokens: [...user.tokens, token]
    };
    await this.userRepository.addOrUpdateEntity(newUser);
  }
}