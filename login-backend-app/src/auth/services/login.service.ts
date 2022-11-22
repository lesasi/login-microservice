import { Injectable } from "@nestjs/common";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
  ){}

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    const isSame = await this.comparePassword(password, user.password);
    if(!isSame) {
      return {
        error: 'Username or password is not correct'
      };
    }
    // generate cookie - proabbly use JWT later
    const cookie = `${user._id}:${Date.now()}`;
    await this.userService.saveTokenToUser(user, cookie);
    return {
      user,
      cookie
    };
  }

  // Comparison of passwords - in future, use Hashes
  private async comparePassword(password: string, userPassword: string) {
    return password === userPassword;
  }
}