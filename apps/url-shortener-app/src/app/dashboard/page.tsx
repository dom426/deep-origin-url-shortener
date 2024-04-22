'use client';

import styles from './page.module.css';
import Cookies from 'js-cookie';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {
  GetShortenedUrlsByAccountRequest,
  GetShortenedUrlsByAccountResponse,
} from '@url-shortener/url-shortener-models';

type shortenedUrl = {
  id: number;
  url: string;
  alias: string;
  visits: number;
  updated_at: string;
};

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [displayError, setDisplayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<shortenedUrl[]>([]);

  useEffect(() => {
    setUsername(Cookies.get('username') ?? '');
    setIsLoggedIn(Cookies.get('token') === 'yes');
    getShortenedUrls();
  }, []);

  async function getShortenedUrls() {
    setIsLoading(true);

    const request: GetShortenedUrlsByAccountRequest = {
      data: {
        type: 'shortenedUrl',
        id: -1,
        attributes: {
          account_id: parseInt(Cookies.get('account_id')?.toString() ?? '-1'),
        },
      },
    };

    fetch('api/getShortenedUrlsByAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(request),
    })
      .then(async (res) => {
        const json = await res.json();
        const finalResponse = json as GetShortenedUrlsByAccountResponse;

        if (finalResponse.errors && finalResponse.errors.length > 0) {
          setDisplayError(finalResponse.errors[0].detail);
        } else {
          const shortenedUrls: shortenedUrl[] = [];
          finalResponse.data.attributes?.shortenedUrls?.forEach((s) => {
            shortenedUrls.push({
              alias: s.alias,
              url: s.url,
              visits: s.visits,
              updated_at: s.updated_at.toDateString(),
              id: s.id,
            });
          });
          setShortenedUrls(shortenedUrls);
        }
      })
      .finally(() => setIsLoading(false));
  }

  const columns: GridColDef[] = [
    { field: 'url', headerName: 'Original Url', width: 300 },
    { field: 'alias', headerName: 'Alias', width: 100 },
    { field: 'visits', headerName: 'Visits', width: 100 },
    { field: 'updated_at', headerName: 'Last Updated', width: 200 },
  ];

  return (
    <div className={styles.page}>
      {isLoggedIn && <div>Welcome, {username}!</div>}
      <div className={styles.dashboard}>
        <DataGrid loading={isLoading} rows={shortenedUrls} columns={columns} />
      </div>
      {displayError && <div>{displayError}!</div>}
    </div>
  );
}
