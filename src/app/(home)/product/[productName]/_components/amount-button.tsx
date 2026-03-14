'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export const AmountButton = () => {
  const [amount, setAmount] = useState(1)

  const BUTTON_STYLE = 'terminal-hover cursor-pointer select-none'

  return (
    <div className="bg-surface flex h-full items-center justify-center gap-4 border px-3 py-3.5 font-bold lg:w-9/12">
      <button
        onClick={() => amount > 1 && setAmount((prev) => prev - 1)}
        className={cn(BUTTON_STYLE)}
      >
        <span aria-hidden="true">[ - ]</span>
        <span className="sr-only">-</span>
      </button>

      {amount < 10 ? `0${amount}` : amount}

      <button
        onClick={() => setAmount((prev) => prev + 1)}
        className={cn(BUTTON_STYLE)}
      >
        <span aria-hidden="true">[ + ]</span>
        <span className="sr-only">+</span>
      </button>
    </div>
  )
}
