'use client'

import { AmountButton } from '@/components/shared'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { useState } from 'react'

type ProductActionsProps = {
  slug: string
  name: string
  price: number
  stock: number
  imageUrl: string
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

  const [quantity, setQuantity] = useState(111)

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
        <div className="my-6 flex flex-col gap-1">
          <p className="text-error-text text-xs font-bold tracking-widest uppercase">
            <span aria-hidden="true">[ ! ] UPLINK_ERROR: STOCK_MISMATCH</span>
            <span className="sr-only">! Uplink error: stock mismatch</span>
          </p>
          <p className="text-error-text/80 mt-2 text-xs leading-tight">
            Only <span className="text-accent font-bold">{stock}</span> units
            available. Please adjust your request
          </p>
        </div>
      )}
    </div>
  )
}
