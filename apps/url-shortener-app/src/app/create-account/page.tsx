'use client';

import { FormEvent, useState } from 'react';
import styles from './page.module.css';
import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '@url-shortener/url-shortener-models';
import Logo from '../../components/logo/logo';
import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const [displayError, setDisplayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (username && password) {
      const request: CreateAccountRequest = {
        data: {
          type: 'account',
          id: -1,
          attributes: {
            username: username,
            password: password,
          },
        },
      };

      fetch('https://fr9v5qx1-3001.use2.devtunnels.ms/api/createAccount', {
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
          const finalResponse = json as CreateAccountResponse;
          console.log(finalResponse);

          if (finalResponse.errors && finalResponse.errors.length > 0) {
            setDisplayError(finalResponse.errors[0].detail);
          } else if (!finalResponse.data.id) {
            setDisplayError('User was not created with given credentials!');
          } else {
            router.push('/login');
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setDisplayError('Both username and password are required!');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <Logo isBig={true} />
      </div>
      <form className={styles.form} onSubmit={onCreateAccount}>
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
          {isLoading ? 'Submitting...' : 'Create Account'}
        </button>
      </form>
      {displayError && <div>{displayError}</div>}
    </div>
  );
}
