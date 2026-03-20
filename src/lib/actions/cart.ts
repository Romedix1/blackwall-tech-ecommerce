'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

type CartItem = {
  slug: string
  quantity: number
}

export async function saveCartInDb(cart: CartItem[]) {
  const session = await auth()

  if (!session?.user.id) {
    return { error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    await prisma.cart.upsert({
      where: { userId: userId },
      update: {
        items: {
          deleteMany: {},
          create: cart.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity || 1,
          })),
        },
      },
      create: {
        userId: userId,
        items: {
          create: cart.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity || 1,
          })),
        },
      },
    })

    return { success: true }
  } catch (error) {}
}
