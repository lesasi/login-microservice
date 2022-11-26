import { IUser } from "../../user/interfaces/user.interface";

export interface ILoginRedirectBody {
  redirectUrl: string;
}

export interface IRedirectState {
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
    cookieName: string,
    redirectUrl: string,
  },
  error?: {
    message: string;
  }
}

export interface ICreateUserEmailAndPasswordOutput extends ILoginEmailAndPasswordOutput {}

export interface ICreateUserRedirectBody {
  redirectUrl: string;
}

export interface ICreateUserEmailAndPassword {
  email: string;
  password: string;
}