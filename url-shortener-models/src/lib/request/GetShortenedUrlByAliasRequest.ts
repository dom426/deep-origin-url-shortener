import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number().optional(),
    attributes: z.object({
      alias: z.string(),
    }),
  }),
});

export type GetShortenedUrlByAliasRequest = z.infer<typeof schema>;
