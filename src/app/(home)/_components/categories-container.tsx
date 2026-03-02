import { CategoriesCard } from '@/app/(home)/_components/'
import { CATEGORY_UI_REGISTRY } from '@/app/(home)/_components/category-ui-registry'
import { prisma } from '@/lib/prisma'

export const CategoriesContainer = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { Product: true },
      },
    },
  })

  return (
    <div className="flex flex-col gap-4 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {categories.map((category, index) => {
        const uiCategory = CATEGORY_UI_REGISTRY[category.slug]

        const categoryObject = {
          name: category.name,
          image: uiCategory.image,
          productCount: category._count.Product,
        }

        if (!uiCategory) return null
        return (
          <CategoriesCard
            className={uiCategory.className}
            key={`category-card-${index}`}
            index={index + 1}
            category={categoryObject}
          />
        )
      })}
    </div>
  )
}
