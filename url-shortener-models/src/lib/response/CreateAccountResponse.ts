import { z } from 'zod';

const errorSchema = z.object({
  detail: z.string(),
  status: z.number(),
});
const schema = z.object({
  data: z.object({
    type: z.string(),
    id: z.number(),
  }),
  errors: z.array(errorSchema).optional(),
});

export type CreateAccountResponse = z.infer<typeof schema>;
