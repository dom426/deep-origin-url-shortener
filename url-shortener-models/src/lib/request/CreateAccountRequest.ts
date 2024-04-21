import { z } from 'zod';

const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number().optional(),
    attributes: z.object({
      username: z.string(),
      password: z.string(),
    }),
  }),
});

export type CreateAccountRequest = z.infer<typeof schema>;
