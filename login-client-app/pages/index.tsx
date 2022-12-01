import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sample</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </div>

  )
}

export async function getStaticProps() {
  // const allPostsData = getSortedPostsData()
  // return {
  //   props: {
  //     allPostsData
  //   }
  // }
}
