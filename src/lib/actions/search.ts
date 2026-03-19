'use server'

import { prisma } from '@/lib/prisma'

export async function SearchInDb(query: string) {
  if (!query || query.trim() === '') {
    return { products: [], categories: [] }
  }

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 5,
      }),
      prisma.category.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
      }),
    ])

    return { products, categories }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ PRODUCT_FETCHING_ERROR ]:', error)
    }
    return { products: [], categories: [] }
  }
}
