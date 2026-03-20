'use client'

import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import { useSession } from 'next-auth/react'
import { MouseEvent } from 'react'

type ProductType = {
  slug: string
  name: string
  price: number
  image: string
  quantity?: number
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

  const { status } = useSession()
  const isAuth = status === 'authenticated'

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    addItem(
      product.slug,
      product.name,
      product.price,
      quantity,
      product.image,
      isAuth,
    )
  }

  return (
    <Button onClick={handleAddToCart} variant="primary" className={className}>
      <span aria-hidden="true">[ Add_to_cart ]</span>
      <span className="sr-only">Add to cart</span>
    </Button>
  )
}
