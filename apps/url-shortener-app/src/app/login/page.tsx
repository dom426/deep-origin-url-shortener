'use client';

import { FormEvent, useState } from 'react';
import styles from './page.module.css';
import {
  LoginRequest,
  LoginResponse,
} from '@url-shortener/url-shortener-models';
import Logo from '../../components/logo/logo';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Login() {
  const [displayError, setDisplayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (username && password) {
      const request: LoginRequest = {
        data: {
          type: 'account',
          id: -1,
          attributes: {
            username: username,
            password: password,
          },
        },
      };

      //TODO: TEMPORARY TESTING
      console.log('LOGGING IN');
      console.log(request);
      router.push('/dashboard');
      Cookies.set('token', 'yes');
      Cookies.set('username', username);
      return;

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(request),
      })
        .then(async (res) => {
          console.log(res);
          const json = await res.json();
          console.log(json);
          const finalResponse = json as LoginResponse;
          console.log(finalResponse);

          if (finalResponse.errors && finalResponse.errors.length > 0) {
            setDisplayError(finalResponse.errors[0].detail);
          } else if (!finalResponse.data.id) {
            setDisplayError('User was not found with given credentials!');
          } else {
            router.push('/dashboard');
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setDisplayError('Both username and password are required to login!');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <Logo isBig={true} />
      </div>
      <form className={styles.form} onSubmit={onLogin}>
        <input
          type="text"
          required={true}
          name="username"
          placeholder="Username"
        />
        <input
          type="password"
          required={true}
          name="password"
          placeholder="Password"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      {displayError && <div>{displayError}</div>}
    </div>
  );
}
