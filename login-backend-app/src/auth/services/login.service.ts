import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/services/user.service";
import { IAPIResult, ICreateUserEmailAndPassword, ICreateUserRedirectBody, IEmailPasswordFlowOutput, ILoginEmailAndPassword, ILoginRedirectBody, IRedirectState } from "../interfaces/auth.interface";
import { EncodingService } from "../../utils/services/encoding.service";

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly encodingService: EncodingService,
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

  private async getRedirectOutput(
    body: ICreateUserRedirectBody | ILoginRedirectBody, 
    frontEndPath: string,
    cookies: Record<string, string>
  ) {
    const redirectUrl = body.redirectUrl;
    // Do check for cookie here itself
    // Create state variable, convert to string and send to login frontend
    const state: IRedirectState = {
      redirectUrl,
    };
    const encodedState = await this.encodingService.encodeObjectToString(state);
    const frontEndUrl = `${this.configService.get('frontEndLoginUrl')}/${frontEndPath}?state=${encodedState}`;
    return frontEndUrl;
  }

  async loginWithEmailAndPassword(body: ILoginEmailAndPassword, state: string): Promise<IAPIResult<IEmailPasswordFlowOutput>> {
    const user = await this.userService.getUserByEmail(body.email);
    if(!user) {
      return {
        error: {
          message: `User not found with email ${body.email}`
        }
      };
    }
    const isSame = await this.encodingService.comparePassword(body.password, user.password);
    if(!isSame) {
      return {
        error: {
          message: 'Password is not correct'
        }
      };
    }
    const { token: cookie } = await this.userService.generateAndSaveTokenToUser(user);
    const decodedState: IRedirectState = await this.encodingService.decodeStringToObject(state);
    return {
      success: {
        user,
        cookie,
        cookieName: this.configService.get('authCookieName'),
        redirectUrl: decodedState.redirectUrl,
      }
    };
  }

  async createUserWithEmailAndPassword(
    body: ICreateUserEmailAndPassword,
    state: string,
  ): Promise<IAPIResult<IEmailPasswordFlowOutput>> {
    const user = await this.userService.createUserWithEmailAndPassword(body.email, body.password);
    const { token: cookie } = await this.userService.generateAndSaveTokenToUser(user);
    const decodedState: IRedirectState = await this.encodingService.decodeStringToObject(state);
    return {
      success: {
        user,
        cookie,
        cookieName: this.configService.get('authCookieName'),
        redirectUrl: decodedState.redirectUrl,
      }
    };
  }

  async getUserDetailsFromCookie(cookie: string) {
    const { _id, email } = await this.userService.getUserFromToken(cookie);
    return {
      _id,
      email
    };
  }

  async logoutUser(cookies: Record<string, string>) {
    const authCookieName = this.configService.get('authCookieName');
    const token = cookies[authCookieName];
    const { user } = await this.userService.removeTokenFromUser(token);
    return user;
  }
}