'use client'

import { Button } from '@/components/ui'
import { useCart } from '@/hooks/use-cart'
import { MouseEvent } from 'react'

type ProductType = {
  slug: string
  name: string
  price: number
  image: string
}

type AddToCartButtonProps = {
  className?: string
  quantity?: number
  product: ProductType
}

export const AddToCartButton = ({
  product,
  className,
  quantity = 1,
}: AddToCartButtonProps) => {
  const { addItem } = useCart()

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    addItem(product.slug, product.name, product.price, quantity, product.image)
  }

  return (
    <Button onClick={handleAddToCart} variant="primary" className={className}>
      <span aria-hidden="true">[ Add_to_cart ]</span>
      <span className="sr-only">Add to cart</span>
    </Button>
  )
}
