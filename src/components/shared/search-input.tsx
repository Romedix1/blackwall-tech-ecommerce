'use client'

import { Input, Separator } from '@/components/ui'
import { useMobileMenu } from '@/hooks'
import { useDebounce } from '@/hooks'
import { SearchInDb } from '@/lib/actions'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  ComponentPropsWithoutRef,
  RefObject,
  useEffect,
  useId,
  useState,
} from 'react'

interface SearchInputProps extends ComponentPropsWithoutRef<'input'> {
  ref?: RefObject<HTMLInputElement | null>
  variant?: 'default' | 'navigation' | 'filter'
  inputClassName?: string
  containerClassName?: string
  placeholder?: string
  id?: string
}

type SearchResultItem = {
  name: string
  slug: string
}

type SearchResults = {
  products: SearchResultItem[]
  categories: SearchResultItem[]
}

export const SearchInput = ({
  ref,
  variant = 'default',
  inputClassName,
  containerClassName,
  placeholder,
  id: customId,
  ...props
}: SearchInputProps) => {
  const generateId = useId()
  const id = customId || generateId

  const [value, setValue] = useState('')
  const [results, setResults] = useState<SearchResults | undefined>({
    products: [],
    categories: [],
  })
  const [isFocus, setIsFocus] = useState(false)

  const debounceSearch = useDebounce(value, 1000)

  const { toggle } = useMobileMenu()

  useEffect(() => {
    const fetchResults = async () => {
      if (debounceSearch) {
        try {
          const data = await SearchInDb(debounceSearch)
          setResults(data)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ PRODUCT_FETCHING_ERROR ]:', error)
          }
          return []
        }
      } else {
        setResults({ products: [], categories: [] })
      }
    }

    fetchResults()
  }, [debounceSearch])

  return (
    <div className={cn('relative w-80 xl:w-100', containerClassName)}>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <Input
          id={id}
          ref={ref}
          type="search"
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(e) => setValue(e.target.value)}
          placeholder=" "
          {...props}
          className={cn(
            'peer bg-surface hover:border-primary-hover caret-accent h-10 rounded-none border py-2.5 pr-26 pl-4 text-sm transition-colors duration-200 placeholder-shown:caret-transparent focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
            inputClassName,
          )}
        />

        <div
          aria-hidden="true"
          className="text-text-second peer-focus:[&_.cursor]:animate-blink pointer-events-none absolute top-1/2 left-4 flex -translate-y-1/2 items-center text-sm uppercase opacity-0 transition-opacity peer-placeholder-shown:opacity-100"
        >
          &gt; {placeholder ? placeholder : 'search_database'}
          <span className="cursor">_</span>
        </div>
      </form>

      {(variant === 'navigation' || variant === 'filter') && (
        <div className="absolute top-1/2 right-3 hidden -translate-y-1/2 text-xs lg:block">
          <span className="text-accent uppercase">
            [
            {variant === 'navigation'
              ? ' ctrl + k'
              : variant === 'filter' && ' / '}
            ]
          </span>
        </div>
      )}

      {((results?.categories && results.categories.length > 0) ||
        (results?.products && results.products.length > 0)) && (
        <div
          className={cn(
            'bg-surface absolute top-12 w-full border p-4',
            !isFocus && 'hidden',
          )}
        >
          {results?.products && results.products.length > 0 && (
            <>
              <h4 className="text-accent uppercase">Products</h4>
              <Separator className="my-4" />
            </>
          )}
          {results?.products.map((item) => {
            return (
              <Link
                onClick={toggle}
                className="terminal-hover group my-4 flex outline-none"
                href={`/product/${item.slug}`}
                key={item.slug}
              >
                <span className="mr-2 hidden group-hover:inline-block group-focus:block">
                  &gt;
                </span>
                {item.name}
              </Link>
            )
          })}

          {results?.categories && results.categories.length > 0 && (
            <>
              {results.products.length > 0 && <Separator className="my-4" />}

              <h4 className="text-accent uppercase">Categories</h4>
              <Separator className="my-4" />
            </>
          )}
          {results?.categories.map((item) => {
            return (
              <Link
                onClick={toggle}
                className="terminal-hover group my-4 mb-0 flex outline-none"
                href={`/products/${item.slug}`}
                key={item.slug}
              >
                <span className="mr-2 hidden group-hover:inline-block group-focus:block">
                  &gt;
                </span>
                {item.name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
