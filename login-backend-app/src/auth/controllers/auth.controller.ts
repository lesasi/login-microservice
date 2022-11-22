import { Controller, Get, Post } from "@nestjs/common";
import { LoginService } from "../services/login.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
  ){}

  @Get('/login-redirect')
  async loginRedirect() {
    // This will be where the client backend will go to.
    // This will redirect to our login frontend app
    // We pass a query variable state containing things like REDIRECT_URL, and 
    // any other variable the client passes
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