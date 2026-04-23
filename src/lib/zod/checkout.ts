import { addressSchema } from '@/lib/zod/schemas'
import { z } from 'zod'

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Name too short').includes(' ', {
      message: 'Full identity required (First and Last name)',
    }),
    email: z
      .email({ message: 'Invalid email address' })
      .min(1, { message: 'Empty email address' }),
    phone: z.string().trim().min(9, 'Phone number too short'),
    orderToken: z.uuid({ message: 'Critical Error: Missing security token' }),
  })
  .extend(addressSchema.shape)
