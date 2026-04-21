import * as z from 'zod'

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/

export const UsernameField = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .trim()

export const PasswordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(128, 'Password must be at most 128 characters long')
  .regex(
    PASSWORD_REGEX,
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  )

export const PasswordMatchschema = {
  password: PasswordSchema,
  confirmPassword: z.string().min(1, 'Confirm your password'),
}

type PasswordMatchType = z.infer<z.ZodObject<typeof PasswordMatchschema>>

export const validatePasswords = (data: PasswordMatchType) =>
  data.password === data.confirmPassword

export const passwordMatchError = {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}
