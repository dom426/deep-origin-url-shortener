import { z } from 'zod';

const errorSchema = z.object({
  detail: z.string(),
  status: z.number(),
});
const shortenedUrl = z.object({
  id: z.number(),
  alias: z.string(),
  url: z.string(),
  visits: z.number(),
  updated_at: z.date(),
});
const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number(),
    attributes: z
      .object({
        shortenedUrls: z.array(shortenedUrl).optional(),
      })
      .optional(),
  }),
  errors: z.array(errorSchema).optional(),
});

export type GetShortenedUrlsByAccountResponse = z.infer<typeof schema>;
