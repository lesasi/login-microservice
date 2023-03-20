import React from "react";
import Layout from "../../components/layout";
import Head from "next/head";
import { CustomForm } from "../../components/CustomForm";
import { AllowedFormInputTypes, IFormItem } from "../../components/CustomForm/types";
import styles from './create-user.module.css';
import { ICreateUserInput } from "../../types/create-user.interface";
import { createUser } from "../../actions/user-login";
import { GetServerSideProps } from "next/types";

const formItems: IFormItem[] = [
  { id: 'email', inputType: AllowedFormInputTypes.text, label: 'Email:', required: true },
  { id: 'password', inputType: AllowedFormInputTypes.password, label: 'Password:', required: true },
];

export default ({ data: { query } }) => {
  const [formData, setFormData] = React.useState<ICreateUserInput>({
    email: '',
    password: ''
  });
  const [currentStep, setCurrentStep] =  React.useState<number>(0);

  const submitUsername = (e: React.FormEvent, data: { email: string }) => {
    e.preventDefault();
    setFormData({ ...formData, email: data.email });
    setCurrentStep(1);
  }

  const submitForm = async (e: React.FormEvent, data: { password: string }) => {
    e.preventDefault();
    setFormData({ ...formData, password: data.password });
    // TODO: create type for output
    const response = await createUser<{ url: string }>(formData, query);
    console.log('response ', response);
    window.location.href = response.url;
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
          ['Set Email', 'Set Password'].map((item, index) => {
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
                <h2 className={styles.formItemHeading}>Write email</h2>
                <CustomForm key={currentStep} formItems={[{...formItems[0], defaultValue: formData.email }]} submitForm={submitUsername} submitButtonLabel='Next' />
              </div>
            ):
            (
              <div>
                <h2 className={styles.formItemHeading}>Write password</h2>
                <CustomForm key={currentStep} formItems={[{...formItems[1], defaultValue: formData.password }]} submitForm={submitForm} />
              </div>
            )
        }
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;
  return {
    props: {
      data: {
        query
      }
    }
  };
}