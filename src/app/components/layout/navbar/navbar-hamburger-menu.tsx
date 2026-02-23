'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export const NavbarHamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className="group flex h-6 w-6 flex-col items-center justify-center"
    >
      <div
        className={cn(
          `bg-text-main ease-in-ou h-0.5 w-6 transition-all duration-300`,
          isOpen ? 'translate-y-2 rotate-45' : '',
        )}
      />

      <div
        className={cn(
          'bg-text-main my-1.5 h-0.5 w-6 transition-all duration-200',
          isOpen ? 'opacity-0' : 'opacity-100',
        )}
      />

      <div
        className={cn(
          `bg-text-main h-0.5 w-6 transition-all duration-300 ease-in-out`,
          isOpen ? '-translate-y-2 -rotate-45' : '',
        )}
      />
    </div>
  )
}
