'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UsernameSchema } from '@/lib/zod'
import { revalidatePath } from 'next/cache'

export async function changeUsername(newUsername: string) {
  const session = await auth()
  const userId = session?.user.id

  const UPDATE_COOLDOWN = 60 * 60 * 1000

  if (!userId) {
    return { message: 'Unauthorized', success: false }
  }

  const validation = UsernameSchema.safeParse({ username: newUsername })

  if (!validation.success) {
    return {
      message: validation.error.issues[0].message,
      success: false,
    }
  }

  const validatedUsername = validation.data.username

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
