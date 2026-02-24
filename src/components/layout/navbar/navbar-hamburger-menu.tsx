'use client'

import { useMobileMenu } from '@/hooks/use-mobile-menu'
import { cn } from '@/lib/utils'

export const NavbarHamburgerMenu = () => {
  const { isOpen, toggle } = useMobileMenu()

  const colorStyle =
    'bg-text-main group-focus:bg-background group-hover:bg-background'

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={toggle}
        className="group terminal-hover flex h-7 w-7 flex-col items-center justify-center"
      >
        <div
          className={cn(
            `h-0.5 w-6 transition-transform duration-300 ease-in-out`,
            isOpen ? 'translate-y-2 rotate-45' : '',
            colorStyle,
          )}
        />

        <div
          className={cn(
            'my-1.5 h-0.5 w-6 transition-opacity duration-200',
            isOpen ? 'opacity-0' : 'opacity-100',
            colorStyle,
          )}
        />

        <div
          className={cn(
            `ease-in-ou h-0.5 w-6 transition-transform duration-300`,
            isOpen ? '-translate-y-2 -rotate-45' : '',
            colorStyle,
          )}
        />
      </button>
    </>
  )
}
