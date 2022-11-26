import { IUser } from "../../user/interfaces/user.interface";

export interface ILoginRedirectBody {
  redirectUrl: string;
}

export interface ILoginRedirectState {
  redirectUrl: string;
}

export interface ILoginEmailAndPassword {
  email: string;
  password: string;
}

export interface ILoginEmailAndPasswordOutput {
  success?: {
    user: IUser,
    cookie: string,
    redirectUrl: string,
  },
  error?: {
    message: string;
  }
}