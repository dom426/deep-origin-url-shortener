import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    attributes: z.object({
      alias: z.string(),
      url: z.string().url(),
      account_id: z.number().optional(),
    }),
  }),
});

export type CreateShortenedUrlRequest = z.infer<typeof schema>;
