import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Name too short')
    .includes(' ', { message: 'Full identity required (First and Last name)' }),
  shippingAddress: z.string().trim().min(3, 'Address too short'),
  email: z
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Empty email address' }),
  city: z.string().trim().min(2, 'City required'),
  zipCode: z.string().trim().min(2, 'Zip code required'),
  phone: z.string().trim().min(9, 'Phone number too short'),
})
