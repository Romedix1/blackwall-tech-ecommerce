import { BuildNotPublic } from '@/app/shared-build/[id]/_components/BuildNotPublic'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getImageUrl } from '@/lib'
import Image from 'next/image'
import { ImageNotFound } from '@/components/ui'
import Link from 'next/link'

type SharedBuildPageProps = {
  params: Promise<{ id: string }>
}

export default async function SharedBuildPage({
  params,
}: SharedBuildPageProps) {
  const { id } = await params

  const sharedBuild = await prisma.build.findFirst({
    where: { id },
    select: {
      name: true,
      public: true,
      updatedAt: true,
      createdBy: {
        select: {
          username: true,
        },
      },
      items: {
        select: {
          quantity: true,
          productSlug: true,
          product: {
            select: {
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
  if (!sharedBuild) {
    redirect('/')
    return null
  }

  if (!sharedBuild.public) {
    return <BuildNotPublic />
  }

  const itemsWithImages = await Promise.all(
    sharedBuild.items.map(async (item) => {
      const imageUrl = await getImageUrl(
        item.product.category.slug,
        item.productSlug,
      )
      return {
        ...item,
        imageUrl,
      }
    }),
  )

  const totalPrice = sharedBuild.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity
  }, 0)

  return (
    <div className="mt-12">
      <header className="mb-12 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-1">
          <p className="text-accent text-xs tracking-[0.3em] uppercase">
            <span aria-hidden="true">[ System_Manifest_Uplink ]</span>
            <span className="sr-only">System manifest uplink</span>
          </p>
          <h1 className="text-3xl font-bold tracking-tighter uppercase lg:text-5xl">
            {sharedBuild.name}
          </h1>
          <div className="text-text-second mt-4 flex gap-8 text-sm uppercase">
            <p>Owner: {sharedBuild.createdBy.username}</p>
            <p>
              <span aria-hidden="true">Last_updated:</span>{' '}
              <span className="sr-only">Last updated:</span>{' '}
              {new Date(sharedBuild.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-second text-sm font-bold tracking-widest uppercase">
          <span aria-hidden="true">&gt; Hardware_Configuration:</span>
          <span className="sr-only">Hardware configuration</span>
        </h2>
        <div className="border">
          <div className="grid gap-px">
            {itemsWithImages.map((item) => (
              <Link
                href={`/product/${item.productSlug}`}
                key={item.productSlug}
                className="bg-surface hover:bg-accent/40 flex flex-col gap-6 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-30 w-30 p-2">
                  {item.imageUrl ? (
                    <Image
                      alt={item.product.name}
                      src={item.imageUrl}
                      className="object-contain"
                      fill
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageNotFound />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-accent text-sm tracking-wider uppercase">
                    {item.product.category.slug}
                  </span>
                  <span className="text-sm font-bold sm:text-base">
                    {item.product.name}
                  </span>
                </div>

                <div className="lg:text-right">
                  <p className="text-accent font-bold">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <p className="text-text-second text-sm uppercase">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="text-text-second mt-6 text-xs tracking-widest uppercase">
            <span aria-hidden="true">Total_Configuration_Value</span>
            <span className="sr-only">Total configuration value</span>
          </p>
          <p className="text-accent mt-2 text-4xl font-bold tracking-tighter lg:text-5xl">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
      </section>
    </div>
  )
}
