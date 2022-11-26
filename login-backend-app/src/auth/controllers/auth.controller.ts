import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ICreateUserEmailAndPassword, ICreateUserRedirectBody, ILoginEmailAndPassword, ILoginRedirectBody } from "../interfaces/auth.interface";
import { LoginService } from "../services/login.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
  ){}

  // Input to body: 
  @Get('/login-redirect')
  async loginRedirect(
    @Body() body: ILoginRedirectBody,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // This will be where the client backend will go to.
    // This will redirect to our login frontend app
    const redirectUrl = await this.loginService.loginRedirect(body, req.cookies);
    res.redirect(redirectUrl);
  }

  @Post('/login')
  async login(
    @Body() body: ILoginEmailAndPassword,
    @Param('state') state: string, 
    @Res({ passthrough: true }) res: Response,
  ) {
    // After entering email/password, login frontend will hit this
    // We should make sure the frontend app passes the state
    const { success, error } = await this.loginService.loginWithEmailAndPassword(body, state);
    if(success) {
      res.cookie(success.cookieName, success.cookie);
      res.redirect(success.redirectUrl);
      return;
    } 
    else {
      // Handle errors later
    }
  }

  @Get('/create-user-redirect')
  async createUserRedirect(
    @Body() body: ICreateUserRedirectBody,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Client create endpoint comes here
    // We redirect to our create user frontend app
    const redirectUrl = await this.loginService.createUserRedirect(body, req.cookies);
    res.redirect(redirectUrl);
  }

  @Post('/create-user')
  async createUser(
    @Body() body: ICreateUserEmailAndPassword,
    @Param('state') state: string, 
    @Res({ passthrough: true }) res: Response,
  ) {
    // Frontend client app comes here
    // It gets REDIRECT_URL from the state
    const { success, error } = await this.loginService.createUserWithEmailAndPassword(body, state);
    if(success) {
      res.cookie(success.cookieName, success.cookie);
      res.redirect(success.redirectUrl);
      return;
    } 
    else {
      // Handle errors later
    }
  }
  
  @Get('/get-user')
  async getUser() {
    // This is the endpoint getting user details from the cookie
    // We'll probably get the entire request itself so we can get the cookie ourself
    // get user based on cookie and return it
  }
}