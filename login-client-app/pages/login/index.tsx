import Head from "next/head";
import { GetServerSideProps } from "next/types";
import React from "react";
import { CustomForm } from "../../components/CustomForm";
import { AllowedFormInputTypes, IFormItem } from "../../components/CustomForm/types";
import Layout from "../../components/layout";
import { ILoginFormInput } from "../../types";

const formItems: IFormItem[] = [
  { id: 'username', inputType: AllowedFormInputTypes.text, label: 'Username:', defaultValue: '' },
  { id: 'password', inputType: AllowedFormInputTypes.password, label: 'Password:', defaultValue: '' },
];

export default ({ data: { processedData, query1 } }) => {
  const submitForm = (e: React.FormEvent, formData: ILoginFormInput) => {
    e.preventDefault()
    console.log('formdata ', formData)
    console.log('data ', processedData)
    console.log('query1 ', query1)
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
  const serverUrl = process.env.SERVER_URL;
  const data = await fetch(`${serverUrl}/auth/sample`, {});
  const processedData = await data.json();
  const query1 = context.query;
  return {
    props: {
      data: {
        processedData,
        query1
      }
    }
  };
}