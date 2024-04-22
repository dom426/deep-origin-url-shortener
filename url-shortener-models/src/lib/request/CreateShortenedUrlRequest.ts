import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number().optional(),
    attributes: z.object({
      alias: z.string(),
      url: z.string(),
      account_id: z.number().optional(),
    }),
  }),
});

export type CreateShortenedUrlRequest = z.infer<typeof schema>;
