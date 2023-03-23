import Head from 'next/head';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Login Microservice</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <Image
          src="/images/monke.jpg" 
          className={utilStyles.borderCircle}
          height={344}
          width={344}
          alt="monke"
        />
        <p>
          this is the home page
        </p>
      </section>
    </Layout>
  );
}