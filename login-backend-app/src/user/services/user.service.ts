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
    const existingUser = await this.userRepository.findOne({ email });
    if(existingUser) {
      throw new Error(`User with email ${email} already exists!`);
    }
    const encodedPassword = await this.encodingService.createHashFromString(password);
    const user: IUser = {
      _id: uuid(),
      email,
      password: encodedPassword,
      tokens: []
    };
    await this.userRepository.addOrUpdateEntity(user);
    return user;
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ email });
    if(!user) {
      throw new Error(`User not found with email ${email}`);
    }
    const isSame = await this.encodingService.compareStringWithHash(password, user.password);
    if(!isSame) {
      throw new Error('Password is not correct');
    }
    console.log('Fetched user: ', user)
    return user;
  }

  async generateAndSaveTokenToUser(user: IUser) {
    const token = await this.encodingService.encodeObjectToString({ _id: user._id });
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
    const { success, error } = await this.encodingService.decodeStringToObject<{ _id: string }>(token);
    let user: IUser;
    if(success) {
      user = await this.userRepository.findOne({
        _id: success._id,
        tokens: token
      });
    }
    if((error && error === 'INVALID_JWT_SIGNATURE') || !user) {
      throw new Error('Invalid token/cookie supplied, user not verified');
    }
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