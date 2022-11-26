import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { request } from "http";
import { ILoginRedirectBody } from "../interfaces/auth.interface";
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
  async login() {
    // After entering email/password, login frontend will hit this
    // We get the user by email, and then check if password matches
    // If no, we reject
    // If yes, we redirect to thr REDIRECT_URL supplied by the client in login-redirect
    // We should make sure the frontend app passes the state
    // We set the generated cookie
  }

  @Get('/create-user-redirect')
  async createUserRedirect() {
    // Client create endpoint comes here
    // We redirect to our create user frontend app
  }

  @Post('/create-user')
  async createUser() {
    // Frontend client app comes here
    // We receive the creds, create user, and redirect to supplied REDIRECT_URL
    // It gets REDIRECT_URL from the state
    // Set cookie before returning
  }
  
  @Get('/get-user')
  async getUser() {
    // This is the endpoint getting user details from the cookie
    // We'll probably get the entire request itself so we can get the cookie ourself
    // get user based on cookie and return it
  }
}