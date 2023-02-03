import Head from "next/head";
import React from "react";
import Layout from "../../components/layout";
import { LoginForm } from "../../components/LoginForm";
import { ILoginFormInput } from "../../types";

export default () => {
  const submitForm = (e: React.FormEvent, formData: ILoginFormInput) => {
    e.preventDefault()
    console.log('formdata ', formData)
  }
  return (
    <Layout>
      <Head>
        <title>Login page</title>
      </Head>
      <div>
        <LoginForm submitForm={submitForm}/>
      </div>
    </Layout>
  );
}