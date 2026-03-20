'use server'

import { auth } from '@/auth'
import { getImageUrl } from '@/lib'
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
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ CART_SAVING_ERROR ]:', error)
    }
  }
}

export async function fetchCartFromDb() {
  try {
    const session = await auth()

    if (!session) {
      return []
    }

    const userId = session.user.id

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      select: {
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                slug: true,
                name: true,
                price: true,
                category: {
                  select: {
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!cart || !cart.items.length) {
      return []
    }

    return cart.items.map((item) => ({
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imgSrc: getImageUrl(item.product.category.slug, item.product.slug),
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ FETCH_CART_ERROR ]:', error)
    }
    return []
  }
}
