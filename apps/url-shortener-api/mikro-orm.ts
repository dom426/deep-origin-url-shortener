import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { Account } from './src/database/entities/Account.entity';
import { ShortenedUrl } from './src/database/entities/ShortenedUrl.entity';

const config: Options = {
  dbName: process.env.DB_NAME || 'url_shortener',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'deepOrigin123',
  entities: [Account, ShortenedUrl],
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  discovery: { disableDynamicFileAccess: false },
  dynamicImportProvider: (id) => import(id),
  debug: true,
  migrations: {
    path: './src/database/migrations',
  },
};

export default config;
