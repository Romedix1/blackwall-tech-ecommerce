'use client'

import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks'

export const NavbarCart = () => {
  const { toggle } = useCart()

  const { items } = useCart()

  const total = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <button
      onClick={toggle}
      className={cn(
        'terminal-hover group active:bg-primary-active flex cursor-pointer items-center gap-2 lg:px-2 lg:py-1.5',
      )}
    >
      <ShoppingCart className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />

      <span
        className={cn(
          'text-xs font-bold sm:text-base',
          total > 99 && 'sm:text-xs',
        )}
      >
        [ {total < 10 ? `0${total}` : total > 99 ? `99+` : total} ]
      </span>
      <span className="sr-only">Cart: {total} items</span>
    </button>
  )
}
