'use client'

import { AmountButton } from '@/components/shared'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { useCart } from '@/hooks/use-cart'
import { useState } from 'react'

type ProductActionsProps = {
  slug: string
  name: string
  price: number
  imageUrl: string
}

export const ProductActions = ({
  slug,
  name,
  price,
  imageUrl,
}: ProductActionsProps) => {
  const cartProduct = {
    slug: slug,
    name: name,
    price: price,
    image: imageUrl,
  }

  const [quantity, setQuantity] = useState(1)

  return (
    <div className="mb-12 flex flex-col items-stretch gap-4 lg:mb-0 lg:flex-row">
      <AmountButton slug={slug} quantity={quantity} setQuantity={setQuantity} />

      <AddToCartButton
        quantity={quantity}
        product={cartProduct}
        className="h-full w-full px-1.5 py-3.5"
      />
    </div>
  )
}
