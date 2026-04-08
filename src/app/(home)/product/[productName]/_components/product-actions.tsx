'use client'

import { AmountButton } from '@/components/shared'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { QuantityError } from '@/components/ui/quantity-error'
import { useState } from 'react'

type ProductActionsProps = {
  slug: string
  name: string
  price: number
  stock: number
  imageUrl: string | null
}

export const ProductActions = ({
  slug,
  name,
  price,
  stock,
  imageUrl,
}: ProductActionsProps) => {
  const cartProduct = {
    slug: slug,
    name: name,
    price: price,
    image: imageUrl,
    stock: stock,
  }

  const [quantity, setQuantity] = useState(1)

  return (
    <div>
      <div className="mb-12 flex flex-col items-stretch gap-4 lg:mb-0 lg:flex-row">
        <AmountButton
          slug={slug}
          stock={stock}
          quantity={quantity}
          setQuantity={setQuantity}
        />

        <AddToCartButton
          quantity={quantity}
          product={cartProduct}
          className="h-full w-full px-1.5 py-3.5"
        />
      </div>

      {stock !== undefined && quantity > stock && (
        <QuantityError stock={stock} />
      )}
    </div>
  )
}
