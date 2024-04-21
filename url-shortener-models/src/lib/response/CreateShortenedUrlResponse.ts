import { z } from 'zod';

const errorSchema = z.object({
  detail: z.string(),
  status: z.number(),
});
const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number(),
    attributes: z
      .object({
        alias: z.string(),
        url: z.string(),
        visits: z.number(),
      })
      .optional(),
  }),
  errors: z.array(errorSchema).optional(),
});

export type CreateShortenedUrlResponse = z.infer<typeof schema>;
