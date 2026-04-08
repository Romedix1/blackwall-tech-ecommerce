import { BestSellersCard } from '@/app/(home)/_components/best-sellers'
import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib'
import { SpecSection } from '@/types'

export const BestSellersContainer = async () => {
  const bestSellers = await prisma.product.findMany({
    take: 4,
    where: { badge: { not: null } },
    select: {
      name: true,
      slug: true,
      badge: true,
      specification: true,
      price: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })

  return (
    <div className="scrollbar-hide relative flex gap-3 overflow-x-scroll sm:gap-4">
      {bestSellers.map(async (product) => {
        const imageUrl = await getImageUrl(product.category.slug, product.slug)

        return (
          <BestSellersCard
            key={product.slug}
            product={{
              name: product.name,
              price: product.price,
              badge: product.badge,
              slug: product.slug,
              specs: product.specification as SpecSection[],
              image: imageUrl,
              stock: 1,
            }}
          />
        )
      })}
    </div>
  )
}
