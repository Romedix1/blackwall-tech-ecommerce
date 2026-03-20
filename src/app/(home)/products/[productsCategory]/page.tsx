import {
  ProductFilters,
  ProductSort,
} from '@/app/(home)/products/[productsCategory]/_components'
import { ProductItem } from '@/app/(home)/products/[productsCategory]/_components'
import { PathNavigator } from '@/components/shared'
import { Separator } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import { mapUrlParamsToPrismaFilters } from '@/lib'
import { Prisma } from '../../../../../generated/prisma'
import { SpecSection } from '@/types/specification'

type SearchParamsType = Promise<{
  [key: string]: string | string[] | undefined
}>

type PageProps = {
  params: Promise<{ productsCategory: string }>
  searchParams: SearchParamsType
}

type ProductSpecification = SpecSection[]

const sortMapping: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  name_asc: { name: 'asc' },
}

export default async function ProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { productsCategory } = await params
  const filterParams = await searchParams
  const { search, sort, priceMin, priceMax, ...paramFilters } = filterParams

  const category = await prisma.category.findUnique({
    where: { slug: productsCategory },
  })

  if (!category) return null

  const allCategoryProducts = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: { specification: true },
  })

  const filters = mapUrlParamsToPrismaFilters(paramFilters)

  const orderBy = sortMapping[sort as string] || sortMapping.newest

  const priceCondition: Prisma.FloatFilter = {}

  if (priceMin) {
    priceCondition.gte = Number(priceMin)
  }

  if (priceMax) {
    priceCondition.lte = Number(priceMax)
  }

  const productsData = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      ...(filters.length > 0 ? { AND: filters } : {}),
      ...(search
        ? {
            name: {
              contains: search as string,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(priceMin && priceMax && { price: priceCondition }),
    },
    orderBy,
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      specification: true,
    },
  })

  const productFilters = new Map<string, Set<string>>()

  allCategoryProducts.forEach((product) => {
    const specs = product.specification as ProductSpecification

    if (!specs) return

    specs.forEach((section) => {
      section.attributes.forEach((attribute) => {
        if (!productFilters.has(attribute.key))
          productFilters.set(attribute.key, new Set())
        productFilters.get(attribute.key)!.add(attribute.value)
      })
    })
  })

  const filtersData = Array.from(productFilters.entries()).map(
    ([key, valuesSet]) => ({
      key,
      values: Array.from(valuesSet),
    }),
  )

  const priceAggregate = await prisma.product.aggregate({
    where: { categoryId: category.id },
    _max: { price: true },
  })

  const maxProductsPrice = priceAggregate._max?.price || 1000

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-y-2 sm:justify-between md:flex-row lg:mb-16">
        <header className="w-full">
          <h1 className="flex flex-col uppercase">
            <span
              aria-hidden="true"
              className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-3"
            >
              <span className="text-2xl leading-none font-bold lg:text-3xl">
                {productsCategory}_division
              </span>

              <span className="inline-block text-xs whitespace-nowrap sm:text-base lg:text-2xl">
                [ {productsData.length}_
                {productsData.length === 1 ? 'record' : 'records'}
                _found ]
              </span>
            </span>

            <span className="sr-only">
              {productsData.length} division {2}{' '}
              {productsData.length === 1 ? 'record' : 'records'} found
            </span>
          </h1>
        </header>

        <PathNavigator productCategory={productsCategory} />
      </div>

      <div className="my-4 flex items-center justify-between gap-4 lg:hidden">
        <ProductFilters
          maxProductsPrice={maxProductsPrice}
          device="mobile"
          filtersData={filtersData}
        />
        <ProductSort device="mobile" />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <ProductFilters
            maxProductsPrice={maxProductsPrice}
            device="desktop"
            filtersData={filtersData}
          />
        </aside>

        <div className="flex flex-col gap-y-8">
          <div className="hidden lg:block">
            <ProductSort device="desktop" />
            <Separator />
          </div>

          <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6">
            {productsData.map((product) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  category={category.slug}
                />
              )
            })}
          </section>
        </div>
      </div>
    </div>
  )
}
