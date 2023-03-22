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
    try {
      const user = await this.userService.getUserByEmailAndPassword(body.email, body.password);
      const { token: cookie } = await this.userService.generateAndSaveTokenToUser(user);
      const { success: decodedState, error } = await this.encodingService.decodeStringToObject<IRedirectState>(state);
      if(error) {
        throw new Error('Invalid state provided');
      }
      return {
        success: {
          user,
          cookie,
          cookieName: this.configService.get('authCookieName'),
          redirectUrl: decodedState.redirectUrl,
        }
      };
    } catch (error) {
      return {
        error: {
          message: error.message,
        }
      };
    }
  }

  async createUserWithEmailAndPassword(
    body: ICreateUserEmailAndPassword,
    state: string,
  ): Promise<IAPIResult<IEmailPasswordFlowOutput>> {
    try {
      const user = await this.userService.createUserWithEmailAndPassword(body.email, body.password);
      const { token: cookie } = await this.userService.generateAndSaveTokenToUser(user);
      const { success: decodedState, error } = await this.encodingService.decodeStringToObject<IRedirectState>(state);
      if(error) {
        throw new Error('Invalid state provided');
      }
      return {
        success: {
          user,
          cookie,
          cookieName: this.configService.get('authCookieName'),
          redirectUrl: decodedState.redirectUrl,
        }
      };
    } catch (error) {
      return {
        error: {
          message: error.message,
        }
      };
    }
  }

  async getUserDetailsFromCookie(cookie: string): Promise<IAPIResult<{ _id: string, email: string }>>  {
    try {
      const { _id, email } = await this.userService.getUserFromToken(cookie);
      return {
        success: {
          _id,
          email
        }
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async logoutUser(token: string) {
    const { user } = await this.userService.removeTokenFromUser(token);
    return user;
  }
}