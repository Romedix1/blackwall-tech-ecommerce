'use server'

import { auth, signOut } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UsernameField } from '@/lib/zod'
import { ResetPasswordSchema } from '@/lib/zod/reset-password-schema'
import { FormState } from '@/types'
import bcrypt from 'bcryptjs'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function changeUsername(newUsername: string) {
  const session = await auth()
  const userId = session?.user.id

  const UPDATE_COOLDOWN = 60 * 60 * 1000

  if (!userId) {
    return { message: 'Unauthorized', success: false }
  }

  const validation = UsernameField.safeParse(newUsername)

  if (!validation.success) {
    return {
      message: validation.error.issues[0].message,
      success: false,
    }
  }

  const validatedUsername = validation.data.toLowerCase()

  try {
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: { equals: validatedUsername, mode: 'insensitive' },
        NOT: { id: userId },
      },
    })

    if (existingUsername) {
      return { message: 'Username already exists', success: false }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        usernameUpdatedAt: true,
      },
    })

    if (user?.usernameUpdatedAt) {
      const now = Date.now()
      const lastUpdated = user.usernameUpdatedAt.getTime()
      const diff = now - lastUpdated

      if (diff < UPDATE_COOLDOWN) {
        const remainingMin = Math.ceil((UPDATE_COOLDOWN - diff) / (1000 * 60))

        return {
          message: `System lock: Wait ${remainingMin}m for next calibration`,
          success: false,
        }
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { username: validatedUsername, usernameUpdatedAt: new Date() },
    })

    return {
      message: 'Identity recalibrated',
      success: true,
      newUsername: validatedUsername,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ CHANGE_USERNAME_ERROR ]:', error)
    }

    return { message: '', success: false }
  }
}

export async function ResetPassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const dataToValidate = {
    currentPassword: rawData.currentPassword,
    password: rawData.newPassword,
    confirmPassword: rawData.confirmNewPassword,
  }

  const validatedData = ResetPasswordSchema.safeParse(dataToValidate)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)
    return {
      error: errorArray,
      fields: rawData,
    }
  }

  try {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return { error: 'Unauthorized', fields: rawData }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    })

    if (!dbUser?.password) {
      return {
        error: 'External accounts (OAuth) cannot modify passwords here',
        fields: rawData,
      }
    }

    const passwordIsCorrect = await bcrypt.compare(
      validatedData.data.currentPassword,
      dbUser.password,
    )

    if (!passwordIsCorrect) {
      return { error: 'Invalid current password', fields: rawData }
    }

    const hashedNewPassword = await bcrypt.hash(validatedData.data.password, 12)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword, passwordChangedAt: new Date() },
    })

    return { success: true, message: 'Uplink initiated', fields: rawData }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ RESET_PASSWORD_ERROR ]:', error)
    }
    return { error: 'Protocol error: Password reset failed', fields: rawData }
  }
}

export const isOAuthUser = async (): Promise<boolean> => {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return false
  }

  const account = await prisma.account.findFirst({
    where: { userId },
    select: { id: true },
  })

  return !!account
}

export async function LogoutAllSessions() {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    })

    if (result) {
      await signOut({ redirectTo: '/login' })
    }

    return { success: true }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[ GLOBAL_LOGOUT_ERROR ]:', error)
    }

    return { error: 'Protocol error: Failed to sever connections' }
  }
}
