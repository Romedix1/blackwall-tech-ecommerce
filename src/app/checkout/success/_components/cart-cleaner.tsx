'use client'

import { useCart } from '@/hooks'
import { useEffect } from 'react'

export function CartCleaner() {
  const { setCart } = useCart()

  useEffect(() => {
    setCart([])
  }, [setCart])

  return <div className="hidden" data-testid="cart-cleaner-checker"></div>
}
