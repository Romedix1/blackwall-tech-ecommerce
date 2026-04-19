import * as z from 'zod'

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .trim(),
})
