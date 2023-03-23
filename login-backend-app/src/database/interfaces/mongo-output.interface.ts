import { IValidationMessage } from "../../utils";

export interface IMongoAddOrUpdateOutput {
  status: boolean;
  errors?: IValidationMessage[];
}