import * as React from 'react';
import { ILoginFormInput } from '../types';

type Props = {
  submitForm: (e: React.FormEvent, formData: ILoginFormInput) => void
}

export const LoginForm: React.FC<Props> = ({ submitForm }) => {
  const [formData, setFormData] = React.useState<ILoginFormInput>({
    username: '',
    password: '',
  });

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  return (
    <form onSubmit={(e) => submitForm(e, formData)}>
      <div>
        <div className="form-field">
          <label htmlFor="username"></label>
          <input type="text" id="text" onChange={handleForm}/>
        </div>
        <div className="form-field">
          <label htmlFor="password"></label>
          <input type="password" id="password" onChange={handleForm}/>
        </div>
      </div>
      <button 
        className="form-button" 
      >
        Submit
      </button>
    </form>
  );
}
