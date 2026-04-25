'use client'

import { SearchInput } from '@/components/shared'
import { useEffect, useRef } from 'react'

type SearchProductProps = {
  device: string
  searchValue: string
  setSearchValue: (e: string) => void
}

export const SearchProduct = ({
  device,
  searchValue,
  setSearchValue,
}: SearchProductProps) => {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (device !== 'desktop') return

      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SearchInput
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      ref={searchRef}
      placeholder="Filter products"
      aria-label="Filter products"
      containerClassName="w-full xl:w-full"
      variant="filter"
    />
  )
}
