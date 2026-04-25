import {
  passwordMatchError,
  PasswordMatchschema,
  UsernameField,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const RegisterSchema = z
  .object({
    username: UsernameField,
    email: z.email('Invalid email address'),
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
