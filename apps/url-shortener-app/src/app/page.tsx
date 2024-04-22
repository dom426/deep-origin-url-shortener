'use client';

import { FormEvent, useState } from 'react';
import styles from './page.module.css';
import { checkValidUrl, generateAlias, onCopy } from '../utils';
import {
  CreateShortenedUrlRequest,
  CreateShortenedUrlResponse,
} from '@url-shortener/url-shortener-models';
import Logo from '../components/logo';

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
          },
        },
      };

      fetch('http://localhost:3000/api/createShortenedUrl', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(request),
      })
        .then(async (res) => {
          console.log(res);
          const json = await res.json();
          console.log(json);
          const finalResponse = json as CreateShortenedUrlResponse;
          console.log(finalResponse);

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
              'localhost:3000/' + finalResponse.data.attributes?.alias
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
        <div>
          <div>Success! Here&apos;s your short URL:</div>
          <div>
            <a href={shortenedUrl}>{shortenedUrl}</a>
            <div onClick={() => onCopy(shortenedUrl)}>
              <span>Copy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
