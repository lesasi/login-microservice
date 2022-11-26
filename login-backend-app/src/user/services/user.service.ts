import { Injectable, OnModuleInit } from "@nestjs/common";
import { IUser } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { v4 as uuid } from 'uuid';
import { EncodingService } from "../../utils/services/encoding.service";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encodingService: EncodingService,
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

  async generateAndSaveTokenToUser(user: IUser) {
    const token = await this.encodingService.encodeId(user._id);
    const updatedUser: IUser = {
      ...user,
      tokens: [...user.tokens, token]
    };
    await this.userRepository.addOrUpdateEntity(updatedUser);
    return {
      user,
      token
    };
  }

  async getUserFromToken(token: string) {
    const _id = await this.encodingService.decodeId(token);
    const user = await this.userRepository.findOne({
      _id,
      tokens: token
    });
    return user;
  }

  async removeTokenFromUser(token: string) {
    const user = await this.getUserFromToken(token);
    const updatedUser: IUser = {
      ...user,
      tokens: user.tokens.filter(t => t !== token)
    };
    await this.userRepository.addOrUpdateEntity(updatedUser);
    return {
      user,
    };
  }
}