import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { BackgroundGlow, Button } from '@/components/ui'
import Image from 'next/image'

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

export const ProductItem = ({ product, category }: ProductItemProps) => {
  const imageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/products/${category}/${product.slug}.webp`

  return (
    <article className="flex flex-col gap-6 border p-4">
      <div className="relative flex aspect-4/3 flex-col items-center justify-center">
        <Image
          alt="Product image"
          src={imageUrl}
          className="relative z-20 object-contain"
          width={300}
          height={300}
          priority={false}
        />
        <BackgroundGlow className="top-[60%] h-24 w-24 blur-[30px]" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-bold uppercase">{product.name}</h2>
        <p className="text-accent font-bold">$ {product.price.toFixed(2)}</p>
      </div>

      <AddToCartButton />
    </article>
  )
}
