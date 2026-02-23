import { ShoppingCart } from 'lucide-react'

export const NavbarCart = () => {
  return (
    <div className="relative">
      <ShoppingCart />
      <div className="bg-accent absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full font-bold">
        2
      </div>
    </div>
  )
}
