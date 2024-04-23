import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import bcrypt from 'bcrypt';
import {
  CreateAccountRequest,
  CreateAccountResponse,
  CreateShortenedUrlRequest,
  CreateShortenedUrlResponse,
  GetShortenedUrlByAliasRequest,
  GetShortenedUrlByAliasResponse,
  GetShortenedUrlsByAccountRequest,
  GetShortenedUrlsByAccountResponse,
  LoginRequest,
  LoginResponse,
  UpdateShortenedUrlRequest,
  UpdateShortenedUrlResponse,
} from '@url-shortener/url-shortener-models';
import { PrismaClient, shortened_url } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService
  ) {}

  db = new PrismaClient();

  @Post('login')
  async login(@Body() req: Request): Promise<LoginResponse> {
    const request = req as LoginRequest;

    const response: LoginResponse = {
      data: {
        type: 'account',
        id: -1,
      },
      errors: [],
    };

    if (
      request &&
      request.data.attributes?.username &&
      request.data.attributes?.password
    ) {
      const salt = process.env.HASH_KEY
        ? process.env.HASH_KEY
        : '$2b$10$6oz8mt.oghlocUsl4efRzO';
      const hashed = await bcrypt.hash(request.data.attributes.password, salt);

      try {
        const account = await this.prisma.account.findFirst({
          where: {
            username: request.data.attributes.username,
            password: hashed,
          },
        });

        if (account && account.id >= 0) {
          response.data.id = account.id;
        } else {
          response.errors.push({
            detail:
              'Account not found with given credentials. Failed to find account!',
            status: 404,
          });
        }
      } catch (ex) {
        response.errors.push({
          detail:
            'Shortened URL not found with given attributes. Failed to login!',
          status: 500,
        });
      }
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
  async create(
    @Body() request: CreateAccountRequest
  ): Promise<CreateAccountResponse> {
    const response: CreateAccountResponse = {
      data: {
        type: 'account',
        id: -1,
      },
      errors: [],
    };

    if (
      request &&
      request.data.attributes?.username &&
      request.data.attributes?.password
    ) {
      const salt = process.env.HASH_KEY
        ? process.env.HASH_KEY
        : '$2b$10$6oz8mt.oghlocUsl4efRzO';
      const hashed = await bcrypt.hash(request.data.attributes.password, salt);

      try {
        const account = await this.prisma.account.create({
          data: {
            username: request.data.attributes.username,
            password: hashed,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        if (account && account.id >= 0) {
          response.data.id = account.id;
        } else {
          response.errors.push({
            detail:
              'Account not created with given credentials. Failed to create account!',
            status: 404,
          });
        }
      } catch (ex) {
        response.errors.push({
          detail:
            'Shortened URL not created with given attributes. Failed to create!',
          status: 500,
        });
      }
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
  async createShortenedUrl(
    @Body() request: CreateShortenedUrlRequest
  ): Promise<CreateShortenedUrlResponse> {
    const response: CreateShortenedUrlResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
        attributes: {},
      },
      errors: [],
    };

    if (
      request &&
      request.data.attributes?.alias &&
      request.data.attributes?.url
    ) {
      try {
        let shortenedUrl: shortened_url;
        if (request.data.attributes.account_id) {
          shortenedUrl = await this.prisma.shortened_url.create({
            data: {
              alias: request.data.attributes.alias,
              url: request.data.attributes.url,
              created_at: new Date(),
              updated_at: new Date(),
              account_id:
                request.data.attributes.account_id >= 0
                  ? request.data.attributes.account_id
                  : undefined,
            },
          });
        } else {
          shortenedUrl = await this.prisma.shortened_url.create({
            data: {
              alias: request.data.attributes.alias,
              url: request.data.attributes.url,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }

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
      } catch (ex) {
        response.errors.push({
          detail: ex,
          status: 500,
        });
      }
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
  async updateShortenedUrl(
    @Body() request: UpdateShortenedUrlRequest
  ): Promise<UpdateShortenedUrlResponse> {
    const response: UpdateShortenedUrlResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
        attributes: {},
      },
      errors: [],
    };

    if (request && request.data.id) {
      try {
        const shortenedUrl = await this.prisma.shortened_url.update({
          where: {
            id: request.data.id,
          },
          data: {
            url: request.data.attributes?.url,
            alias: request.data.attributes?.alias,
            visits: request.data.attributes?.visits,
            updated_at: new Date(),
          },
        });

        if (shortenedUrl && shortenedUrl.id >= 0) {
          response.data.id = shortenedUrl.id;
          response.data.attributes.alias = shortenedUrl.alias;
          response.data.attributes.url = shortenedUrl.url;
        } else {
          response.errors.push({
            detail:
              'Shortened URL not updated with given attributes. Failed to update!',
            status: 404,
          });
        }
      } catch (ex) {
        response.errors.push({
          detail:
            'Shortened URL not updated with given attributes. Failed to update!',
          status: 500,
        });
      }
    } else {
      response.errors.push({
        detail:
          'Given attributes were invalid or incomplete. Failed to update!',
        status: 500,
      });
    }

    return response;
  }

  @Post('getShortenedUrlByAlias')
  async getShortenedUrlByAlias(
    @Body() request: GetShortenedUrlByAliasRequest
  ): Promise<GetShortenedUrlByAliasResponse> {
    const response: GetShortenedUrlByAliasResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
        attributes: {},
      },
      errors: [],
    };

    if (request && request.data.attributes?.alias) {
      try {
        const shortenedUrl = await this.prisma.shortened_url.findFirst({
          where: {
            alias: request.data.attributes.alias,
          },
        });

        if (shortenedUrl && shortenedUrl.id >= 0) {
          response.data.id = shortenedUrl.id;
          response.data.attributes.alias = shortenedUrl.alias;
          response.data.attributes.url = shortenedUrl.url;
          response.data.attributes.visits = shortenedUrl.visits;
        } else {
          response.errors.push({
            detail:
              'Shortened URL not found with given attributes. Failed to get!',
            status: 404,
          });
        }
      } catch (ex) {
        response.errors.push({
          detail: ex,
          status: 500,
        });
      }
    } else {
      response.errors.push({
        detail: 'Given attributes were invalid or incomplete. Failed to get!',
        status: 500,
      });
    }

    return response;
  }

  @Post('getShortenedUrlsByAccount')
  async getShortenedUrlsByAccount(
    @Body() request: GetShortenedUrlsByAccountRequest
  ): Promise<GetShortenedUrlsByAccountResponse> {
    const response: GetShortenedUrlsByAccountResponse = {
      data: {
        type: 'shortenedUrl',
        id: -1,
        attributes: {
          shortenedUrls: [],
        },
      },
      errors: [],
    };

    if (request && request.data.attributes?.account_id >= 0) {
      try {
        const shortenedUrls = await this.prisma.shortened_url.findMany({
          where: {
            account_id: request.data.attributes.account_id,
          },
        });

        if (shortenedUrls) {
          shortenedUrls.forEach((s) => {
            response.data.attributes.shortenedUrls.push({
              id: s.id,
              alias: s.alias,
              url: s.url,
              visits: s.visits,
              updated_at: s.updated_at,
            });
          });
        }
      } catch (ex) {
        response.errors.push({
          detail: ex,
          status: 500,
        });
      }
    } else {
      response.errors.push({
        detail: 'Given attributes were invalid or incomplete. Failed to get!',
        status: 500,
      });
    }

    return response;
  }
}
