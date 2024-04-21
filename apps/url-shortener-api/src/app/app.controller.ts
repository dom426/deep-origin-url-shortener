import { Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import bcrypt from 'bcrypt';
import {
  CreateAccountRequest,
  CreateAccountResponse,
  CreateShortenedUrlRequest,
  CreateShortenedUrlResponse,
  GetShortenedUrlByAliasRequest,
  GetShortenedUrlByAliasResponse,
  LoginRequest,
  LoginResponse,
  UpdateShortenedUrlRequest,
  UpdateShortenedUrlResponse,
} from '@url-shortener/url-shortener-models';
import { initORM } from '../database/orm';
import { Account } from '../database/entities/Account.entity';
import { ShortenedUrl } from '../database/entities/ShortenedUrl.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  async login(req: Request): Promise<LoginResponse> {
    const request = (await req.json()) as LoginRequest;
    const response: LoginResponse = {
      data: {
        type: 'account',
        id: -1,
      },
    };

    if (
      request &&
      request.data.attributes?.username &&
      request.data.attributes?.password
    ) {
      // spin up connection to the DB and find entity based on given attributes
      const db = await initORM();

      const account = await db.em.findOne(Account, {
        username: request.data.attributes.username,
        password: await bcrypt.hash(
          request.data.attributes.password,
          process.env.SALT_KEY ?? '$2b$31$57miCrduVDFHAovsUv7mPO'
        ),
      });

      if (account && account.id >= 0) {
        response.data.id = account.id;
      } else {
        response.errors.push({
          detail: 'Account not found with given credentials. Failed to login!',
          status: 404,
        });
      }

      return response;
    } else {
      response.errors.push({
        detail:
          'Given credentials were invalid or incomplete. Failed to login!',
        status: 500,
      });
    }

    return response;
  }

  @Post('createAccount')
  async create(req: Request): Promise<CreateAccountResponse> {
    const request = (await req.json()) as CreateAccountRequest;
    const response: CreateAccountResponse = {
      data: {
        type: 'account',
        id: -1,
      },
    };

    if (
      request &&
      request.data.attributes?.username &&
      request.data.attributes?.password
    ) {
      const db = await initORM();

      const hashed = await bcrypt.hash(
        request.data.attributes.password,
        process.env.SALT_KEY ?? '$2b$31$57miCrduVDFHAovsUv7mPO'
      );

      const account = new Account();
      account.username = request.data.attributes.username;
      account.password = hashed;
      await db.em.persistAndFlush(account);

      if (account && account.id >= 0) {
        response.data.id = account.id;
      } else {
        response.errors.push({
          detail:
            'Account not created with given credentials. Failed to create account!',
          status: 404,
        });
      }

      return response;
    } else {
      response.errors.push({
        detail:
          'Given credentials were invalid or incomplete. Failed to create account!',
        status: 500,
      });
    }

    return response;
  }

  @Post('createShortenedUrl')
  async createShortenedUrl(req: Request): Promise<CreateShortenedUrlResponse> {
    const request = (await req.json()) as CreateShortenedUrlRequest;
    const response: CreateShortenedUrlResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
      },
    };

    if (
      request &&
      request.data.attributes?.alias &&
      request.data.attributes?.url
    ) {
      const db = await initORM();

      const shortenedUrl = new ShortenedUrl();
      shortenedUrl.alias = request.data.attributes.alias;
      shortenedUrl.url = request.data.attributes.url;
      await db.em.persistAndFlush(shortenedUrl);

      if (shortenedUrl && shortenedUrl.id >= 0) {
        response.data.id = shortenedUrl.id;
        response.data.attributes.alias = shortenedUrl.alias;
        response.data.attributes.url = shortenedUrl.url;
      } else {
        response.errors.push({
          detail:
            'Shortened URL not created with given attributes. Failed to create!',
          status: 404,
        });
      }

      return response;
    } else {
      response.errors.push({
        detail:
          'Given attributes were invalid or incomplete. Failed to create!',
        status: 500,
      });
    }

    return response;
  }

  @Post('updateShortenedUrl')
  async updateShortenedUrl(req: Request): Promise<UpdateShortenedUrlResponse> {
    const request = (await req.json()) as UpdateShortenedUrlRequest;
    const response: UpdateShortenedUrlResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
      },
    };

    if (request && request.data.id) {
      const db = await initORM();

      const shortenedUrl = new ShortenedUrl();
      shortenedUrl.alias = request.data.attributes.alias;
      shortenedUrl.url = request.data.attributes.url;
      await db.em.persistAndFlush(shortenedUrl);

      if (shortenedUrl && shortenedUrl.id >= 0) {
        response.data.id = shortenedUrl.id;
        response.data.attributes.alias = shortenedUrl.alias;
        response.data.attributes.url = shortenedUrl.url;
      } else {
        response.errors.push({
          detail:
            'Shortened URL not created with given attributes. Failed to create!',
          status: 404,
        });
      }

      return response;
    } else {
      response.errors.push({
        detail:
          'Given attributes were invalid or incomplete. Failed to create!',
        status: 500,
      });
    }

    return response;
  }

  @Post('getShortenedUrlByAlias')
  async getShortenedUrlByAlias(
    req: Request
  ): Promise<GetShortenedUrlByAliasResponse> {
    const request = (await req.json()) as GetShortenedUrlByAliasRequest;
    const response: GetShortenedUrlByAliasResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
      },
    };

    if (request && request.data.attributes?.alias) {
      const db = await initORM();

      const shortenedUrl = await db.em.findOne(ShortenedUrl, {
        alias: request.data.attributes.alias,
      });

      if (shortenedUrl && shortenedUrl.id >= 0) {
        response.data.id = shortenedUrl.id;
        response.data.attributes.alias = shortenedUrl.alias;
        response.data.attributes.url = shortenedUrl.url;
      } else {
        response.errors.push({
          detail:
            'Shortened URL not found with given attributes. Failed to get!',
          status: 404,
        });
      }

      return response;
    } else {
      response.errors.push({
        detail: 'Given attributes were invalid or incomplete. Failed to get!',
        status: 500,
      });
    }

    return response;
  }
}
