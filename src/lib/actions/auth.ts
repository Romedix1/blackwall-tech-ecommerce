'use server'

import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/app/api/send-confirmation-email'
import { signIn } from '@/auth'
import { LoginSchema } from '@/lib/zod/login-schema'
import { AuthError } from 'next-auth'

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

export const LoginUser = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const validatedData = LoginSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues.map((issue) => issue.message),
      fields: rawData,
    }
  }

  const { email, password } = validatedData.data
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    })

    return { success: true, message: 'User logged in' }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CallbackRouteError') {
        return {
          error: 'Protocol error: email not verified',
          fields: rawData,
        }
      }

      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Access denied: invalid credentials',
            fields: rawData,
          }
        default:
          return {
            error: 'System failure: auth protocol error',
            fields: rawData,
          }
      }
    }

    throw error
  }
}
