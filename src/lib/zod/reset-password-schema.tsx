import {
  passwordMatchError,
  PasswordMatchschema,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const ResetPasswordSchema = z
  .object({
    currentPassword: z.string(),
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
