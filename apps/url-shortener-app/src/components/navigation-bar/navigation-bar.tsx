'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Logo from '../logo/logo';
import { usePathname } from 'next/navigation';
import styles from './navigation-bar.module.css';

export default function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const isLoggedIn = Cookies.get('token') === 'yes';
    setIsLoggedIn(isLoggedIn);
  }, []);

  const onLogout = () => {
    Cookies.set('token', 'no');
    setIsLoggedIn(false);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Logo isBig={false} />
        <span className={styles.logoSubText}>The best in URL shortening!</span>
      </div>
      <div className={styles.navbarMenu}>
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
