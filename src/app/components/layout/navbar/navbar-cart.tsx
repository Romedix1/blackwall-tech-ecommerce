import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export const NavbarCart = () => {
  return (
    <button
      className={cn(
        'terminal-hover group active:bg-primary-active flex cursor-pointer items-center gap-2 lg:px-2 lg:py-1.5',
      )}
    >
      <ShoppingCart className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />

      <span className="font-mono text-[12px] font-bold sm:text-base">
        [ 02 ]
      </span>
      <span className="sr-only">Cart: 2 items</span>
    </button>
  )
}
