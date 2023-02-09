import * as React from 'react';
import formStyle from './custom-form.module.css';
import { IFormItem } from './types';

type Props = {
  submitForm: (e: React.FormEvent, formData: any) => void;
  formItems: IFormItem[];
  submitButtonLabel?: string;
}

export const CustomForm: React.FC<Props> = ({ submitForm, formItems, submitButtonLabel }) => {
  const defaultState = formItems.reduce((acc, item) => {
    return {
      ...acc,
      [item.id]: item.defaultValue || ''
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
              <input 
                id={item.id} 
                value={formData[item.id]}
                required={!!item.required}
                type={item.inputType} 
                onChange={handleFormItem}
              />
            </div>
          );
        })
      }
      <button 
        className="form-button" 
      >
        { submitButtonLabel || 'Submit' }
      </button>
    </form>
  );
}
