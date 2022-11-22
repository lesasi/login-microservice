import { ValidationError } from "class-validator";

export interface IValidationMessage {
  propertyPath: string,
  valueGiven: any,
  constraintsBroken: string[]
}

export const transformErrorMessages = (errors: ValidationError[]) => {
  return errors.map(e => transformErrorMessage(e, e.property)).flat();
}

const transformErrorMessage = (error: ValidationError, path: string): IValidationMessage[] => {
  if(error.children && error.children.length > 0) {
    return error.children.map(c => transformErrorMessage(c, `${path}.${c.property}`)).flat();
  }
  return [{
    propertyPath: path,
    valueGiven: error.value,
    constraintsBroken: Object.values(error.constraints)
  }];
}