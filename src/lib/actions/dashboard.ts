'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UsernameField } from '@/lib/zod'
import { ResetPasswordSchema } from '@/lib/zod/reset-password-schema'
import { FormState } from '@/types'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

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

  const validatedUsername = validation.data

  try {
    const existingUsername = await prisma.user.findFirst({
      where: { username: validatedUsername, NOT: { id: userId } },
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

    revalidatePath('/dashboard/settings')

    return { message: 'Identity recalibrated', success: true }
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
    const user = await auth()
    const userId = user?.user.id

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
  const user = await auth()

  const userId = user?.user.id

  if (!userId) {
    return false
  }

  const account = await prisma.account.findFirst({
    where: { userId },
    select: { id: true },
  })

  return !!account
}
