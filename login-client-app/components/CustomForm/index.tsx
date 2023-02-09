import * as React from 'react';
import formStyle from './custom-form.module.css';
import { IFormItem } from './types';

type Props = {
  submitForm: (e: React.FormEvent, formData: any) => void;
  formItems: IFormItem[];
}

export const CustomForm: React.FC<Props> = ({ submitForm, formItems }) => {
  const defaultState = formItems.reduce((acc, item) => {
    return {
      ...acc,
      [item.id]: item.defaultValue
    };
  }, {});
  const [formData, setFormData] = React.useState(defaultState);

  const handleFormItem = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  return (
    <form onSubmit={(e) => submitForm(e, formData)} className={formStyle.formContent}>
      {
        formItems.map((item) => {
          return (
            <div key={item.id} className={formStyle.formField}>
              <label htmlFor={item.id}>{item.label}</label>
              <input type={item.inputType} id={item.id} onChange={handleFormItem}/>
            </div>
          );
        })
      }
      <button 
        className="form-button" 
      >
        Submit
      </button>
    </form>
  );
}
