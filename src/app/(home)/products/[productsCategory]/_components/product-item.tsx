import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { BackgroundGlow, ImageNotFound } from '@/components/ui'
import { getImageUrl } from '@/lib'
import Image from 'next/image'
import Link from 'next/link'

type productType = {
  id: string
  slug: string
  name: string
  price: number
}

type ProductItemProps = {
  product: productType
  category: string
}

export const ProductItem = async ({ product, category }: ProductItemProps) => {
  const imageUrl = await getImageUrl(category, product.slug)

  const cartProduct = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: imageUrl,
  }

  return (
    <article>
      <Link
        href={`/product/${product.slug}`}
        className="group hover:border-accent focus:border-accent flex flex-col gap-6 border p-4 outline-none"
      >
        <div className="relative flex aspect-4/3 flex-col items-center justify-center">
          {imageUrl ? (
            <Image
              alt={product.name}
              src={imageUrl}
              className="relative z-20 object-contain"
              width={300}
              height={300}
              priority={false}
            />
          ) : (
            <ImageNotFound />
          )}
          <BackgroundGlow className="top-[60%] h-24 w-24 blur-[30px] group-hover:scale-200" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-bold uppercase">{product.name}</h2>
          <p className="text-accent font-bold">$ {product.price.toFixed(2)}</p>
        </div>

        <AddToCartButton product={{ ...cartProduct, stock: 1 }} />
      </Link>
    </article>
  )
}
