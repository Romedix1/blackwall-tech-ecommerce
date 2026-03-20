'use client'

import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction } from 'react'

type AmountButtonProps = {
  slug: string
  className?: string
  handleUpdate?: (slug: string, quantity: number, isAuth: boolean) => void
  quantity: number
  setQuantity?: Dispatch<SetStateAction<number>>
}

export const AmountButton = ({
  className,
  slug,
  handleUpdate,
  quantity,
  setQuantity,
}: AmountButtonProps) => {
  const BUTTON_STYLE = 'terminal-hover cursor-pointer select-none'

  const { status } = useSession()
  const isAuth = status === 'authenticated'

  const handleUpdateQuantity = (newAmount: number) => {
    handleUpdate?.(slug, newAmount, isAuth)
    setQuantity?.(newAmount)
  }

  return (
    <div
      className={cn(
        'bg-surface flex h-full items-center justify-center gap-4 border px-3 py-3.5 font-bold lg:w-9/12',
        className,
      )}
    >
      <button
        onClick={() => quantity > 1 && handleUpdateQuantity(quantity - 1)}
        className={cn(BUTTON_STYLE)}
      >
        <span aria-hidden="true">[ - ]</span>
        <span className="sr-only">-</span>
      </button>

      {quantity < 10 ? `0${quantity}` : quantity}

      <button
        onClick={() => handleUpdateQuantity(quantity + 1)}
        className={cn(BUTTON_STYLE)}
      >
        <span aria-hidden="true">[ + ]</span>
        <span className="sr-only">+</span>
      </button>
    </div>
  )
}
