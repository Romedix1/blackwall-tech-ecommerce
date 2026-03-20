'use client'

import { Search } from 'lucide-react'
import { useMobileMenu } from '@/hooks'

export const MobileSearchTrigger = () => {
  const onOpen = useMobileMenu((state) => state.onOpen)

  return (
    <button
      onClick={() => onOpen(true)}
      aria-label="Open search"
      className="terminal-hover lg:hidden"
    >
      <Search className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  )
}
