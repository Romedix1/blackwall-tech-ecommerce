import { AmountButton } from '@/app/(home)/product/[productName]/_components'
import { PerformanceBenchmark } from '@/app/(home)/product/[productName]/_components'
import { SpecificationList } from '@/app/(home)/product/[productName]/_components'
import { PathNavigator } from '@/components/shared'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { Separator } from '@/components/ui'
import { ImageCorner } from '@/components/ui/image-corner'
import { getImageUrl } from '@/lib/get-image-url'
import { prisma } from '@/lib/prisma'
import { BenchmarkType, SpecSection } from '@/types'
import Image from 'next/image'

type ProductPageProps = {
  params: Promise<{ productName: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productName } = await params

  const product = await prisma.product.findUnique({
    where: { slug: productName },
    select: {
      slug: true,
      name: true,
      price: true,
      quantity: true,
      specification: true,
      performance: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })

  if (!product) return null

  const imageUrl = getImageUrl(product.category.slug, product.slug)

  return (
    <div className="container mx-auto mt-16">
      <div className="lg:mb-24 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="col-start-2 mb-6 flex flex-col gap-2">
          <PathNavigator productCategory={'gpu'} productName={product.slug} />
          <h1 className="text-2xl font-bold uppercase lg:text-4xl">
            {product.name}
          </h1>
        </div>

        <div className="bg-surface relative row-span-2 row-start-1 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            className="scale-80 object-contain xl:scale-90"
            width={400}
            height={400}
          />
          <ImageCorner className="absolute top-0.5 left-0 rotate-90" />
          <ImageCorner className="absolute right-0 bottom-0.5 rotate-270" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-accent text-2xl font-bold lg:text-3xl">
              $ {product.price.toFixed(2)}
            </h2>
            <p className="text-text-second text-xs uppercase lg:text-sm">
              {product.quantity > 0 ? (
                <>
                  <span aria-hidden="true">[ in_stock ]</span>
                  <span className="sr-only">in stock</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">[ out_of_stock ]</span>
                  <span className="sr-only">out of stock</span>
                </>
              )}
            </p>
          </div>
          <Separator className="my-4 lg:my-8" />

          <div className="mb-12 flex flex-col items-stretch gap-4 lg:mb-0 lg:flex-row">
            <AmountButton />
            <AddToCartButton className="h-full w-full px-1.5 py-3.5" />
          </div>
        </div>
      </div>

      {product.specification && Array.isArray(product.specification) && (
        <SpecificationList
          specification={product.specification as SpecSection[]}
        />
      )}

      {product.performance && Array.isArray(product.performance) && (
        <PerformanceBenchmark
          performance={product.performance as BenchmarkType[]}
        />
      )}
    </div>
  )
}
