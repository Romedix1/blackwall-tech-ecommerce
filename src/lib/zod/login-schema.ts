import * as z from 'zod'

export const LoginSchema = z.object({
  email: z
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Empty email address' }),
  password: z.string().min(1, { message: 'Empty password' }),
})
