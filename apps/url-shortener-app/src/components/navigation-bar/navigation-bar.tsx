'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Logo from '../logo/logo';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navigation-bar.module.css';

export default function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get('token') === 'yes';
    setIsLoggedIn(isLoggedIn);
  }, [pathname]);

  const onLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('account_id');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Logo isBig={false} />
        <span className={styles.logoSubText}>The best in URL shortening!</span>
      </div>
      <div className={styles.navbarMenu}>
        <a
          className={`${styles.navbarMenuItem} ${
            pathname === '/' ? styles.active : ''
          }`}
          href="/"
        >
          Shorten
        </a>
        {isLoggedIn && (
          <a
            className={`${styles.navbarMenuItem} ${
              pathname === '/dashboard' ? styles.active : ''
            }`}
            href="/dashboard"
          >
            Dashboard
          </a>
        )}
        {!isLoggedIn && (
          <a
            className={`${styles.navbarMenuItem} ${
              pathname === '/create-account' ? styles.active : ''
            }`}
            href="/create-account"
          >
            Create Account
          </a>
        )}
        {!isLoggedIn && (
          <a
            className={`${styles.navbarMenuItem} ${
              pathname === '/login' ? styles.active : ''
            }`}
            href="/login"
          >
            Login
          </a>
        )}
        {isLoggedIn && (
          <div className={styles.navbarMenuItem} onClick={onLogout}>
            Logout
          </div>
        )}
      </div>
    </div>
  );
}
