import Head from 'next/head';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Login Microservice</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Home page</p>
        <p>
          Home page
        </p>
      </section>
    </Layout>
  );
}