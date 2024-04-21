import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number(),
    attributes: z.object({
      url: z.string(),
      alias: z.string(),
      visits: z.number(),
    }),
  }),
});

export type UpdateShortenedUrlRequest = z.infer<typeof schema>;
