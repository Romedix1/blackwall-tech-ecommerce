'use client'

import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction, useState } from 'react'

type AmountButtonProps = {
  slug: string
  className?: string
  handleUpdate?: (slug: string, quantity: number) => void
  quantity?: number
  setQuantity?: Dispatch<SetStateAction<number>>
}

export const AmountButton = ({
  className,
  slug,
  handleUpdate,
  quantity,
  setQuantity,
}: AmountButtonProps) => {
  const [amount, setAmount] = useState(quantity || 1)

  const currentAmount = quantity !== undefined ? quantity : amount

  const BUTTON_STYLE = 'terminal-hover cursor-pointer select-none'

  const handleDecrement = () => {
    if (currentAmount > 1) {
      const newAmount = currentAmount - 1

      setAmount(newAmount)
      setQuantity?.(newAmount)
      handleUpdate?.(slug, newAmount)
    }
  }

  const handleIncrement = () => {
    const newAmount = currentAmount + 1

    setAmount(newAmount)
    setQuantity?.(newAmount)
    handleUpdate?.(slug, newAmount)
  }

  return (
    <div
      className={cn(
        'bg-surface flex h-full items-center justify-center gap-4 border px-3 py-3.5 font-bold lg:w-9/12',
        className,
      )}
    >
      <button onClick={handleDecrement} className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ - ]</span>
        <span className="sr-only">-</span>
      </button>

      {currentAmount < 10 ? `0${currentAmount}` : currentAmount}

      <button onClick={handleIncrement} className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ + ]</span>
        <span className="sr-only">+</span>
      </button>
    </div>
  )
}
