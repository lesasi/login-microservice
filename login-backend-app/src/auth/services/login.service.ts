import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/services/user.service";
import { ICreateUserRedirectBody, ILoginEmailAndPassword, ILoginEmailAndPasswordOutput, ILoginRedirectBody, ILoginRedirectState } from "../interfaces/auth.interface";
import { AuthService } from "./auth.service";

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ){}

  async createUserRedirect(body: ICreateUserRedirectBody, cookies: Record<string, string>) {
    const frontEndUrl = await this.getRedirectOutput(body, 'create-user', cookies);
    return frontEndUrl;
  }

  async loginRedirect(body: ILoginRedirectBody, cookies: Record<string, string>) {
    const frontEndUrl = await this.getRedirectOutput(body, 'login-user', cookies);
    return frontEndUrl;
  }

  async loginWithEmailAndPassword(body: ILoginEmailAndPassword, state: string): Promise<ILoginEmailAndPasswordOutput> {
    const user = await this.userService.getUserByEmail(body.email);
    const isSame = await this.authService.comparePassword(body.password, user.password);
    if(!isSame) {
      return {
        error: {
          message: 'Username or password is not correct'
        }
      };
    }
    // generate cookie - proabbly use JWT later
    const cookie = `${user._id}:${Date.now()}`;
    await this.userService.saveTokenToUser(user, cookie);
    const decodedState: ILoginRedirectState = await this.authService.decodeToObject(state);
    return {
      success: {
        user,
        cookie,
        redirectUrl: decodedState.redirectUrl,
      }
    };
  }

  private async getRedirectOutput(
    body: ICreateUserRedirectBody | ILoginRedirectBody, 
    frontEndPath: string,
    cookies: Record<string, string>
  ) {
    const redirectUrl = body.redirectUrl;
    // Do check for cookie here itself
    // Create state variable, convert to string and send to login frontend
    const state: ILoginRedirectState = {
      redirectUrl,
    };
    const encodedState = await this.authService.encodeObject(state);
    const frontEndUrl = `${this.configService.get('frontEndLoginUrl')}/${frontEndPath}?state=${encodedState}`;
    return frontEndUrl;
  }
}