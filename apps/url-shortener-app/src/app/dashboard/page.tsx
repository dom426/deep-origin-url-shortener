'use client';

import styles from './page.module.css';
import Cookies from 'js-cookie';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {
  GetShortenedUrlsByAccountRequest,
  GetShortenedUrlsByAccountResponse,
  UpdateShortenedUrlRequest,
} from '@url-shortener/url-shortener-models';
import { onCopy } from '../../utils';

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

  async function onUpdateRow(
    updatedRow: shortenedUrl,
    originalRow: shortenedUrl
  ) {
    if (updatedRow.alias.length !== 6) {
      return originalRow;
    }

    setIsLoading(true);

    const request: UpdateShortenedUrlRequest = {
      data: {
        type: 'shortenedUrl',
        id: updatedRow.id,
        attributes: {
          url: updatedRow.url,
          alias: updatedRow.alias,
          visits: updatedRow.visits,
        },
      },
    };

    fetch('api/updateShortenedUrl', {
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
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return updatedRow;
  }

  async function getShortenedUrls() {
    setIsLoading(true);

    const accountId = Cookies.get('account_id')?.toString();

    if (accountId) {
      const request: GetShortenedUrlsByAccountRequest = {
        data: {
          type: 'shortenedUrl',
          id: -1,
          attributes: {
            account_id: parseInt(accountId ?? '-1'),
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
                updated_at: new Date(s.updated_at).toLocaleString(),
                id: s.id,
              });
            });
            setShortenedUrls(shortenedUrls);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setDisplayError('User not logged in!');
      setIsLoading(false);
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'alias',
      headerName: 'Alias',
      width: 100,
      editable: true,
    },
    { field: 'url', headerName: 'Original Url', width: 300 },
    { field: 'visits', headerName: 'Visits', width: 100 },
    { field: 'updated_at', headerName: 'Last Updated', width: 200 },
    {
      field: 'copy',
      headerName: 'Copy',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const onCopyRow = () => {
          const shortenedUrl = shortenedUrls.find((s) => s.id === params.id);
          if (shortenedUrl) {
            onCopy(
              process.env.URL_SHORTENER_APP_HOST
                ? process.env.URL_SHORTENER_APP_HOST
                : 'http://localhost:5000' + '/' + shortenedUrl.alias
            );
          }
        };
        return <button onClick={onCopyRow}>Copy</button>;
      },
    },
    {
      field: 'go',
      headerName: 'Go',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const onGoTo = () => {
          const shortenedUrl = shortenedUrls.find((s) => s.id === params.id);
          if (shortenedUrl) {
            window.open(
              process.env.URL_SHORTENER_APP_HOST
                ? process.env.URL_SHORTENER_APP_HOST
                : 'http://localhost:5000' + '/' + shortenedUrl.alias,
              '_blank'
            );
          }
        };
        return <button onClick={onGoTo}>Go</button>;
      },
    },
  ];

  return (
    <div className={styles.page}>
      {isLoggedIn && (
        <div className={styles.welcomeMessage}>Welcome, {username}!</div>
      )}
      {displayError && (
        <div className={styles.errorMessage}>{displayError}</div>
      )}
      <div className={styles.dashboard}>
        <DataGrid
          loading={isLoading}
          rows={shortenedUrls}
          columns={columns}
          processRowUpdate={(u, r) => onUpdateRow(u, r)}
          onProcessRowUpdateError={(e) => console.log(e)}
        />
      </div>
    </div>
  );
}
