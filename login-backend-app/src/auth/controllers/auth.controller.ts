import { Body, Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ICreateUserEmailAndPassword, ICreateUserRedirectBody, ILoginEmailAndPassword, ILoginRedirectBody } from "../interfaces/auth.interface";
import { LoginService } from "../services/login.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
  ){}

  @Get('/sample')
  async sampleReq(
    @Body() body,
  ) {
    console.log('Sample auth called with body ', body)
    return {
      status: 'This is data from backend'
    };
  }

  // Input to body: 
  @Post('/login-redirect')
  async loginRedirect(
    @Body() body: ILoginRedirectBody,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // This will be where the client backend will go to.
    // This will redirect to our login frontend app
    const url = await this.loginService.loginRedirect(body, req.cookies);
    // TODO: add parameters like status (whether to login or not), error message etc.
    res.send({
      url
    });
  }

  @Post('/login')
  async login(
    @Body() body: ILoginEmailAndPassword,
    @Query('state') state: string, 
    @Res({ passthrough: true }) res: Response,
  ) {
    // After entering email/password, login frontend will hit this
    // We should make sure the frontend app passes the state
    const { success, error } = await this.loginService.loginWithEmailAndPassword(body, state);
    if(success) {
      const url = `${success.redirectUrl}?cookie=${success.cookie}&user_id=${success.user._id}`;
      return {
        url
      };
    } 
    else {
      // Handle errors later
      return {
        error
      };
    }
  }

  @Post('/create-user-redirect')
  async createUserRedirect(
    @Body() body: ICreateUserRedirectBody,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Client create endpoint comes here
    // We redirect to our create user frontend app
    const url = await this.loginService.createUserRedirect(body, req.cookies);
    // TODO: add parameters like status (whether to login or not), error message etc.
    res.send({
      url
    });
  }

  @Post('/create-user')
  async createUser(
    @Body() body: ICreateUserEmailAndPassword,
    @Query('state') state: string, 
    @Res({ passthrough: true }) res: Response,
  ) {
    // Frontend client app comes here
    // It gets REDIRECT_URL from the state
    const { success, error } = await this.loginService.createUserWithEmailAndPassword(body, state);
    if(success) {
      const url = `${success.redirectUrl}?cookie=${success.cookie}&user_id=${success.user._id}`;
      return {
        url
      };
    } 
    else {
      // Handle errors later
      return {
        error
      };
    }
  }
  
  @Get('/get-user')
  async getUser(@Query('cookie') cookie: string) {
    const { success, error } = await this.loginService.getUserDetailsFromCookie(cookie);
    if(success) {
      return success;
    }
    else {
      return {
        error
      };
    }
  }

  @Get('/logout')
  async logout(@Query('cookie') cookie: string) {
    try {
      const user = await this.loginService.logoutUser(cookie);
      return user._id;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}