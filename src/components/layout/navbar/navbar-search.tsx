'use client'

import { SearchInput } from '@/components/shared'
import { useEffect, useRef } from 'react'

type NavbarSearchProps = {
  variant?: 'default' | 'navigation'
}

export const NavbarSearch = ({ variant = 'default' }: NavbarSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div>
      <SearchInput
        ariaLabel="Search in database"
        ref={inputRef}
        variant={variant}
        containerClassName="hidden lg:block"
      />
    </div>
  )
}
