'use client'

import { SearchInput } from '@/components/shared'
import { useDebounce } from '@/hooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const SearchShell = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  )

  const debouncedValue = useDebounce(searchValue, 600)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue.trim()) {
      params.set('search', debouncedValue)
    } else {
      params.delete('search')
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [debouncedValue, pathname, router])

  return (
    <SearchInput
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Filter products (by name)"
      ariaLabel="Filter products by name"
      containerClassName="w-full xl:w-full"
      variant="filter"
    />
  )
}
