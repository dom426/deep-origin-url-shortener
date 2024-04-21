'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  GetShortenedUrlByAliasRequest,
  GetShortenedUrlByAliasResponse,
} from '@url-shortener/url-shortener-models';

export default function Alias({ params }: { params: { alias: string } }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [displayError, setDisplayError] = useState('');

  useEffect(() => {
    getUrlByAlias();
  });

  const getUrlByAlias = async () => {
    const request: GetShortenedUrlByAliasRequest = {
      data: {
        type: 'account',
        id: -1,
        attributes: {
          alias: params.alias,
        },
      },
    };

    fetch('http://localhost:3001/shortenedUrl/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
      console.log(res);
      const json = await res.json();
      console.log(json);
      const finalResponse = json as GetShortenedUrlByAliasResponse;
      console.log(finalResponse);

      if (finalResponse.errors && finalResponse.errors.length > 0) {
        setDisplayError(finalResponse.errors[0].detail);
        setIsNotFound(true);
      } else if (!finalResponse.data.attributes?.url) {
        setDisplayError('A valid url was not tied to this alias!');
        setIsNotFound(true);
      } else {
        setOriginalUrl(finalResponse.data.attributes?.url);
      }
    });
  };

  return (
    <section className={styles['container']}>
      {isNotFound && <h1>404!</h1>}
      {!isNotFound && (
        <h1>Wait a moment while we take you to {originalUrl} ...</h1>
      )}
      <h1>{displayError}</h1>
    </section>
  );
}
