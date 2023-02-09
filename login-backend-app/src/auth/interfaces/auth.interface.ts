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

export interface IAPIResult<T> {
  success?: T,
  error?: {
    message: string;
  }
}

export interface IEmailPasswordFlowOutput {
  user: IUser,
  cookie: string,
  cookieName: string,
  redirectUrl: string,
}

export interface ICreateUserRedirectBody {
  redirectUrl: string;
}

export interface ICreateUserEmailAndPassword {
  email: string;
  password: string;
}