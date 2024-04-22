import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number().optional(),
    attributes: z.object({
      account_id: z.number(),
    }),
  }),
});

export type GetShortenedUrlsByAccountRequest = z.infer<typeof schema>;
