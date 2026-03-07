'use client'

import { RadioInput } from '@/app/(home)/products/[productsCategory]/_components'
import { SearchInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type FilterEntry = {
  key: string
  values: string[]
}

type ProductFiltersProps = {
  filtersData: FilterEntry[]
  device: string
}

export const ProductFilters = ({
  filtersData,
  device,
}: ProductFiltersProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const urlSearch = searchParams.get('search') || ''

  const [showAllFilters, setShowAllFilters] = useState(false)
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get('search') || '',
  )
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch)
    setSearchValue(urlSearch)
  }

  useEffect(() => {
    const urlSearch = searchParams.get('sort') || ''

    if (searchValue === urlSearch) return

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchValue) {
        params.set('search', searchValue)
      } else {
        params.delete('search')
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchValue, pathname, router])

  const handleToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }

    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    router.push(pathname, { scroll: false })
  }

  const FILTERS_LIMIT = 5
  const visibleSections = showAllFilters
    ? filtersData
    : filtersData.slice(0, FILTERS_LIMIT)

  const hiddenSectionsCount = filtersData.length - FILTERS_LIMIT
  const isChecked = (key: string, value: string) => {
    return searchParams.get(key) === value
  }

  return (
    <>
      <Button
        className="text-accent w-fit px-4 py-3 text-xs uppercase sm:px-6 sm:text-sm lg:hidden"
        variant="secondary"
      >
        <span aria-hidden="true">[</span>
        <span>+</span>
        <span aria-hidden="true">]</span>
        <span className="ml-2">Filters</span>
      </Button>

      <div className="hidden flex-col gap-8 lg:flex">
        <div className="flex flex-col gap-3">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Filter products"
            ariaLabel="Filter products"
            containerClassName="w-full xl:w-full"
            variant="filter"
          />

          <button
            onClick={() => handleReset()}
            className="text-text-second hover:text-primary-active focus:text-primary-active block cursor-pointer text-left text-sm uppercase"
          >
            <span aria-hidden="true">[ Reset_all_filters ]</span>
            <span className="sr-only">Reset all filters</span>
          </button>
        </div>

        {visibleSections.map((filter) => {
          return (
            <div className="flex flex-col gap-3 uppercase" key={filter.key}>
              <h3 className="text-accent">
                <span aria-hidden="true">{'// '}</span>
                {filter.key}
              </h3>
              <div className="flex flex-col gap-1 uppercase">
                {filter.values.map((value) => (
                  <RadioInput
                    key={value}
                    name={`${device}-${filter.key}`}
                    label={value}
                    checked={isChecked(filter.key, value)}
                    onToggle={() => handleToggle(filter.key, value)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {filtersData.length > FILTERS_LIMIT && (
          <Button
            className="text-xs"
            onClick={() => setShowAllFilters(!showAllFilters)}
          >
            {showAllFilters ? (
              <>
                <span aria-hidden="true">[ Hide_filters ]</span>
                <span className="sr-only">Hide filters</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">
                  [ +{hiddenSectionsCount}_more_filters_available ]
                </span>
                <span className="sr-only">
                  {hiddenSectionsCount} more filters available
                </span>
              </>
            )}
          </Button>
        )}
      </div>
    </>
  )
}
