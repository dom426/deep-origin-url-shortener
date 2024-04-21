import {
  Dictionary,
  EntityManager,
  EntityRepository,
  MikroORM,
  Options,
} from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import config from '../../mikro-orm';
import { ShortenedUrl } from './entities/ShortenedUrl.entity';
import { Account } from './entities/Account.entity';

dotenv.config();

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  shortenedUrl: EntityRepository<ShortenedUrl>;
  account: EntityRepository<Account>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init({
    ...config,
    ...(options as Dictionary),
  });

  return (cache = {
    orm: orm as MikroORM,
    em: orm.em.fork() as EntityManager,
    shortenedUrl: orm.em.getRepository(ShortenedUrl),
    account: orm.em.getRepository(Account),
  });
}
