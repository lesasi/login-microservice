export enum AllowedFormInputTypes {
  text = "text",
  password = "password"
}

export interface IFormItem {
  id: string;
  label: string;
  inputType: AllowedFormInputTypes;
  defaultValue?: string;
}