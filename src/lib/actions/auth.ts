'use server'

import { prisma } from '@/lib/prisma/prisma'
import { RegisterSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/app/api/send-confirmation-email'

type FormState =
  | {
      error: string[] | string
      fields?: Record<string, string>
      success?: never
    }
  | {
      success: true
      fields?: Record<string, string>
      message: string
      error?: never
    }
  | null

export const RegisterUser = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const validatedData = RegisterSchema.safeParse(rawData)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)
    return {
      error: errorArray,
      fields: rawData,
    }
  }

  const { username, email, password } = validatedData.data

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    })

    if (userExists) {
      return {
        error: 'User with this email or username already exists',
        fields: rawData,
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const verificationToken = crypto.randomUUID()

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationToken,
      },
    })

    try {
      await sendVerificationEmail(email, username, verificationToken)
    } catch (emailError) {
      await prisma.user.delete({
        where: { id: newUser.id },
      })

      return {
        error:
          'Protocol error: Could not send verification email. Please try again',
        fields: rawData,
      }
    }

    return { success: true, message: 'Uplink initiated', fields: { email } }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Registration error ]:', error)
    }
    return { error: 'Protocol error: Registration failed', fields: rawData }
  }
}
