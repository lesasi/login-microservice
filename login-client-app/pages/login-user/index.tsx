import Head from "next/head";
import { GetServerSideProps } from "next/types";
import React from "react";
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
    const response = await loginUser(formData, query);
    console.log('response ', response);
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
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const data = await fetch(`${serverUrl}/auth/sample`, {});
  const processedData = await data.json();
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