'use client';

import { FormEvent, useState } from 'react';
import styles from './page.module.css';
import { checkValidUrl, generateAlias, onCopy } from '../utils';
import {
  CreateShortenedUrlRequest,
  CreateShortenedUrlResponse,
} from '@url-shortener/url-shortener-models';
import Logo from '../components/logo/logo';
import Cookies from 'js-cookie';

export default function Index() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [displayError, setDisplayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const originalUrl = formData.get('OriginalUrl')?.toString();

    if (originalUrl) {
      if (!checkValidUrl(originalUrl)) {
        setDisplayError('Invalid URL!');
        return;
      }

      const request: CreateShortenedUrlRequest = {
        data: {
          type: 'account',
          id: -1,
          attributes: {
            alias: generateAlias(),
            url: originalUrl,
            account_id: parseInt(Cookies.get('account_id')?.toString() ?? '-1'),
          },
        },
      };

      fetch('/api/createShortenedUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(request),
      })
        .then(async (res) => {
          const json = await res.json();
          const finalResponse = json as CreateShortenedUrlResponse;

          if (finalResponse.errors && finalResponse.errors.length > 0) {
            setDisplayError(finalResponse.errors[0].detail);
          } else if (
            !finalResponse.data.attributes?.url ||
            !finalResponse.data.attributes?.alias
          ) {
            setDisplayError('Incomplete data was stored!');
          } else {
            setOriginalUrl(finalResponse.data.attributes?.url);
            setShortenedUrl(
              process.env.URL_SHORTENER_APP_HOST
                ? process.env.URL_SHORTENER_APP_HOST
                : 'http://localhost:5000' +
                    '/' +
                    finalResponse.data.attributes?.alias
            );
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setDisplayError('Must input a valid url!');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <Logo isBig={true} />
      </div>
      <form className={styles.form} onSubmit={onGenerate}>
        <input
          type="text"
          name="OriginalUrl"
          value={originalUrl}
          placeholder="Enter the URL to shorten"
          onChange={(e) => {
            setOriginalUrl(e.currentTarget.value);
          }}
        ></input>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {displayError && (
        <div className={styles.errorMessage}>{displayError}</div>
      )}

      {shortenedUrl && (
        <div className={styles.successContainer}>
          <div className={styles.successMessage}>
            Success! Here&apos;s your short URL:
          </div>
          <div className={styles.copyContainer}>
            <a target="_blank" href={shortenedUrl}>
              {shortenedUrl}
            </a>
            <button
              className={styles.copyButton}
              onClick={() => onCopy(shortenedUrl)}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
