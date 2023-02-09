import { CREATE_USER_URL, LOGIN_URL } from "../../constants/urls";
import { ICreateUserInput } from "../../types/create-user.interface";
import { ILoginFormInput } from "../../types/login-user";
import { postToServer } from "../base";

export const loginUser = async (input: ILoginFormInput, query: Object) => {
  const response = await postToServer(LOGIN_URL, input, query);
  return response;
}

export const createUser = async (input: ICreateUserInput, query: Object) => {
  const response = await postToServer(CREATE_USER_URL, input, query);
  return response;
}