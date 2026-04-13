'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

type BuildItem = {
  slug: string
  quantity: number
}

export async function saveBuildToDb(build: BuildItem[]) {
  const session = await auth()

  if (!session?.user.id) {
    return { error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    await prisma.build.upsert({
      where: { userId: userId },
      update: {
        items: {
          deleteMany: {},
          create: build.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
      create: {
        userId: userId,
        items: {
          create: build.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
    })

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ BUILD_SAVING_ERROR ]:', error)
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

    const build = await prisma.build.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!build || !build.items.length) {
      return []
    }

    return build.items.map((item) => ({
      slug: item.productSlug,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imgSrc: null,
      category: item.product.category.slug,
      technical: item.product.technical as Record<string, string>,
      stock: item.product.quantity,
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ FETCH_BUILD_ERROR ]:', error)
    }
    return []
  }
}
