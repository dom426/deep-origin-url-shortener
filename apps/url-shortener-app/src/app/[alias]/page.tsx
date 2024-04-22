'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  GetShortenedUrlByAliasRequest,
  GetShortenedUrlByAliasResponse,
  GetShortenedUrlsByAccountResponse,
  UpdateShortenedUrlRequest,
} from '@url-shortener/url-shortener-models';

export default function Alias({ params }: { params: { alias: string } }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [displayError, setDisplayError] = useState('');

  useEffect(() => {
    getUrlByAlias();
  }, []);

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

    fetch('api/getShortenedUrlByAlias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
      const json = await res.json();
      const finalResponse = json as GetShortenedUrlByAliasResponse;

      if (finalResponse.errors && finalResponse.errors.length > 0) {
        setDisplayError(finalResponse.errors[0].detail);
        setIsNotFound(true);
      } else if (!finalResponse.data.attributes?.url) {
        setDisplayError('A valid url was not tied to this alias!');
        setIsNotFound(true);
      } else {
        onVisitShortenedUrl(
          finalResponse.data.id,
          finalResponse.data.attributes?.url,
          finalResponse.data.attributes?.alias,
          finalResponse.data.attributes?.visits
        ).then(() => {
          window.location.assign(finalResponse.data.attributes?.url ?? '');
          setOriginalUrl(finalResponse.data.attributes?.url ?? '');
        });
      }
    });
  };

  async function onVisitShortenedUrl(
    id: number,
    url: string,
    alias: string,
    visits: number
  ) {
    const request: UpdateShortenedUrlRequest = {
      data: {
        type: 'shortenedUrl',
        id: id,
        attributes: {
          url: url,
          alias: alias,
          visits: visits + 1,
        },
      },
    };

    fetch('api/updateShortenedUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
      const json = await res.json();
      const finalResponse = json as GetShortenedUrlsByAccountResponse;

      if (finalResponse.errors && finalResponse.errors.length > 0) {
        setDisplayError(finalResponse.errors[0].detail);
      }
    });
  }

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
