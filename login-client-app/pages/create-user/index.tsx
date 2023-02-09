import React from "react";
import Layout from "../../components/layout";
import Head from "next/head";
import { CustomForm } from "../../components/CustomForm";
import { AllowedFormInputTypes, IFormItem } from "../../components/CustomForm/types";
import styles from './create-user.module.css';
import { ICreateUserInput } from "../../types/create-user.interface";

const formItems: IFormItem[] = [
  { id: 'username', inputType: AllowedFormInputTypes.text, label: 'Username:', defaultValue: '', required: true },
  { id: 'password', inputType: AllowedFormInputTypes.password, label: 'Password:', defaultValue: '', required: true },
];

export default () => {
  const [formData, setFormData] = React.useState<ICreateUserInput>({
    username: '',
    password: ''
  });
  const [currentStep, setCurrentStep] =  React.useState<number>(0);

  const submitUsername = (e: React.FormEvent, data: { username: string }) => {
    e.preventDefault();
    setFormData({ ...formData, username: data.username });
    setCurrentStep(1);
  }

  const submitForm = (e: React.FormEvent, data: { password: string }) => {
    e.preventDefault();
    console.log('formdata create ', formData)
  }

  const reduceStepNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if(currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Create User</title>
      </Head>
      <div className={styles.createUserStatusTab}>
        <div 
          className={[styles.createUserStatusTabDirection, styles.backgroundColorPink].join(' ')}
          onClick={reduceStepNumber}
        >
          {'<<'}
        </div>
        {
          ['Set Username', 'Set Password'].map((item, index) => {
            let classNames = [styles.createUserStatusTabItem];
            if(currentStep === index) { classNames = [styles.createUserStatusTabItem, styles.backgroundColorGreen]; }
            return (
              <div key={index} className={classNames.join(' ')}>{item}</div>
            );
          })
        }
      </div>
      <div>
        {
          currentStep === 0 ? 
            (
              <div>
                <h2 className={styles.formItemHeading}>Write username</h2>
                <CustomForm formItems={[formItems[0]]} submitForm={submitUsername} submitButtonLabel='Next' />
              </div>
            ):
            (
              <div>
                <h2 className={styles.formItemHeading}>Write password</h2>
                <CustomForm formItems={[formItems[1]]} submitForm={submitForm} />
              </div>
            )
        }
      </div>
    </Layout>
  );
}