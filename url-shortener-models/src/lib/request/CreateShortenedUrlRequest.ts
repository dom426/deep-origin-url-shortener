import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number().optional(),
    attributes: z.object({
      alias: z.string(),
      url: z.string(),
    }),
  }),
});

export type CreateShortenedUrlRequest = z.infer<typeof schema>;
