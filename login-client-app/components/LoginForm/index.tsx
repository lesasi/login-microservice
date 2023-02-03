import * as React from 'react';
import { ILoginFormInput } from '../../types';
import loginStyles from './loginform.module.css';

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
    <form onSubmit={(e) => submitForm(e, formData)} className={loginStyles.formContent}>
        <div className={loginStyles.formField}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" onChange={handleForm}/>
        </div>
        <div className={loginStyles.formField}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={handleForm}/>
        </div>
      <button 
        className="form-button" 
      >
        Submit
      </button>
    </form>
  );
}
