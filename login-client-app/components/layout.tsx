import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={utilStyles.headingLg}>
          <Link href="/" className={utilStyles.colorInherit}>
            Home page
          </Link>
        </h2>
        <h2 className={utilStyles.headingLg}>
          <Link href="/login-user" className={utilStyles.colorInherit}>
            Login page
          </Link>
        </h2>
        <h2 className={utilStyles.headingLg}>
          <Link href="/create-user" className={utilStyles.colorInherit}>
            Create user page
          </Link>
        </h2>
      </header>
      <main>{children}</main>
    </div>
  );
}