import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number(),
    attributes: z.object({
      username: z.string(),
      password: z.string(),
    }),
  }),
});

export type LoginRequest = z.infer<typeof schema>;
