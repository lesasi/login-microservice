export enum AllowedFormInputTypes {
  text = "text",
  password = "password"
}

export interface IFormItem {
  id: string;
  label: string;
  required?: boolean;
  inputType: AllowedFormInputTypes;
  defaultValue?: string;
}