import { FilterCapsule } from '@/app/(home)/pc-builder/[category]/_components'
import { SearchShell } from '@/app/(home)/pc-builder/[category]/_components/search-shell'
import { Button, ImageNotFound } from '@/components/ui'
import { getImageUrl } from '@/lib'
import { prisma } from '@/lib/prisma'
import { SpecSection } from '@/types'
import Image from 'next/image'

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
        {products.map(async (product) => {
          const productImg = await getImageUrl(categorySlug, product.slug)

          return (
            <div
              key={product.id}
              className="bg-surface flex flex-col gap-6 border px-6 py-4 sm:gap-12"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="relative aspect-video h-30 w-full shrink-0 sm:w-fit xl:h-36">
                    {productImg ? (
                      <Image
                        src={productImg}
                        alt={product.name}
                        fill
                        priority={false}
                        className="object-contain"
                      />
                    ) : (
                      <ImageNotFound />
                    )}
                  </div>

                  <div>
                    <p className="font-bold xl:text-lg">{product.name}</p>
                    <p className="text-accent mt-4 hidden text-lg font-bold sm:block xl:text-xl">
                      $ {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 xl:grid-cols-2">
                  {(product.specification as SpecSection[]).map((section) => (
                    <div key={section.id} className="flex flex-col gap-2">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="bg-accent h-px w-2"></span>
                        <h4 className="text-text-second text-xs tracking-widest uppercase xl:text-sm">
                          {section.label}
                        </h4>
                      </div>

                      <div className="flex flex-col gap-1">
                        {section.attributes.map((item) => (
                          <div
                            key={`${section.id}-${item.key}`}
                            className="flex justify-between pb-1 text-xs xl:text-sm"
                          >
                            <span className="text-text-second/80 mr-4 uppercase">
                              {item.key.replace('_', ' ')}
                            </span>
                            <span className="text-right font-medium">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-accent text-lg font-bold sm:hidden">
                  $ {product.price.toFixed(2)}
                </p>
              </div>

              <Button>
                <span aria-hidden="true">[ Select_part ]</span>
                <span className="sr-only">Select part</span>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
