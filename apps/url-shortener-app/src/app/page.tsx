'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { checkValidUrl, generateAlias, onCopy } from '../utils';
import {
  CreateShortenedUrlRequest,
  CreateShortenedUrlResponse,
} from '@url-shortener/url-shortener-models';

export default function Index() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [displayError, setDisplayError] = useState('');

  async function onGenerate() {
    if (!originalUrl) {
      return;
    }

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

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(request),
    }).then(async (res) => {
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
    });
  }

  return (
    <div className={styles.page}>
      <div>
        <span>URL Shortener</span>
      </div>
      <span>Enter the URL to shorten</span>
      <div>
        <div>URL</div>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => {
            setOriginalUrl(e.currentTarget.value);
          }}
        ></input>
        <div onClick={onGenerate}>Shorten</div>
        <div>{displayError}</div>
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
    </div>
  );
}
