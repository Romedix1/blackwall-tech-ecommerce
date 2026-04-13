import { FilterCapsule } from '@/app/(home)/pc-builder/[category]/_components'
import { ProductBlock } from '@/app/(home)/pc-builder/[category]/_components/product-block'
import { SearchShell } from '@/app/(home)/pc-builder/[category]/_components/search-shell'
import { getImageUrl } from '@/lib'
import { prisma } from '@/lib/prisma'
import { SpecSection } from '@/types'

type BuilderCategoryPageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BuilderCategoryPage({
  params,
  searchParams,
}: BuilderCategoryPageProps) {
  const { category: categorySlug } = await params
  const sParams = await searchParams

  const { search, ...technicalFilters } = sParams

  const searchQuery = typeof search === 'string' ? search : undefined

  const technicalConditions = Object.entries(technicalFilters).map(
    ([key, value]) => ({
      technical: {
        path: [key],
        equals: value,
      },
    }),
  )

  const allCategoryProducts = await prisma.product.findMany({
    where: {
      category: { slug: categorySlug },
    },
    select: {
      technical: true,
    },
  })

  const products = await prisma.product.findMany({
    where: {
      AND: [
        { category: { slug: categorySlug } },
        searchQuery
          ? { name: { contains: searchQuery, mode: 'insensitive' } }
          : {},
        ...technicalConditions,
      ],
      category: {
        slug: categorySlug,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      specification: true,
      technical: true,
      price: true,
      quantity: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })

  const IMPORTANT_FILTERS: Record<string, string[]> = {
    cpu: ['socket', 'cores', 'series'],
    gpu: ['vram', 'chipset', 'tdp'],
    motherboards: ['socket', 'chipset', 'formFactor'],
    memory: ['capacity', 'type', 'speed'],
    storage: ['capacity', 'readSpeed', 'writeSpeed'],
    psu: ['wattage', 'efficiency', 'modularity'],
  }

  const keysToExtract = IMPORTANT_FILTERS[categorySlug] || []

  const availableFilters = keysToExtract.map((key) => {
    const uniqueValues = new Set(
      allCategoryProducts
        .map((product) => {
          const tech = product.technical as Record<string, string | number>
          return tech ? tech[key] : undefined
        })
        .filter((filter): filter is string | number => filter !== undefined),
    )

    return {
      categoryKey: key,
      options: Array.from(uniqueValues),
    }
  })

  const resolvedProducts = await Promise.all(
    products.map(async (product) => {
      const productImg = await getImageUrl(categorySlug, product.slug)

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        productImg,
        category: product.category.slug,
        specification: (product.specification as SpecSection[]) ?? [],
        technical: (product.technical as Record<string, string>) ?? {},
      }
    }),
  )

  return (
    <div className="flex flex-col gap-4">
      <SearchShell />

      <div className="flex gap-4 overflow-x-auto pb-2">
        {availableFilters.map((filter) =>
          filter.options.map((option) => {
            return (
              <FilterCapsule
                key={`${filter.categoryKey}-${option}`}
                categoryKey={filter.categoryKey}
                option={option}
              />
            )
          }),
        )}
      </div>

      <div className="flex h-120 flex-col gap-4 overflow-y-auto xl:h-200">
        {resolvedProducts.map((product) => (
          <ProductBlock key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
