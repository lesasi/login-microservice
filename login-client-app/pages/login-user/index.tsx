import Head from "next/head";
import { GetServerSideProps } from "next/types";
import React from "react";
import { getFromServer } from "../../actions/base";
import { loginUser } from "../../actions/user-login";
import { CustomForm } from "../../components/CustomForm";
import { AllowedFormInputTypes, IFormItem } from "../../components/CustomForm/types";
import Layout from "../../components/layout";
import { ILoginFormInput } from "../../types/login-user";

const formItems: IFormItem[] = [
  { id: 'email', inputType: AllowedFormInputTypes.text, label: 'Email:', defaultValue: '' },
  { id: 'password', inputType: AllowedFormInputTypes.password, label: 'Password:', defaultValue: '' },
];

export default ({ data: { processedData, query } }) => {
  const submitForm = async (e: React.FormEvent, formData: ILoginFormInput) => {
    e.preventDefault()
    console.log('processed data ', processedData)
    // TODO: create type for output
    const response = await loginUser<{ url: string, error: { message: string } }>(formData, query);
    if(response.url) {
      window.location.href = response.url;
    }
    else {
      // Handle errors later
      console.log('error: ', response.error)
    }
  }
  return (
    <Layout>
      <Head>
        <title>Login page</title>
      </Head>
      <div>
        <CustomForm formItems={formItems} submitForm={submitForm} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const processedData = await getFromServer<any>(`/auth/sample`, null, true)
  const query = context.query;
  return {
    props: {
      data: {
        processedData,
        query
      }
    }
  };
}