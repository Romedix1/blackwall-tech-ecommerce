import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { RefObject } from 'react'

type SearchInputProps = {
  ref: RefObject<HTMLInputElement | null>
  variant?: 'default' | 'navigation'
  inputClassName?: string
  containerClassName?: string
}

export const SearchInput = ({
  ref,
  variant = 'default',
  inputClassName,
  containerClassName,
}: SearchInputProps) => {
  return (
    <div className={cn('relative hidden w-100 lg:block', containerClassName)}>
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          placeholder=" "
          aria-label="Search in database"
          className={cn(
            'peer bg-surface caret-accent h-10 rounded-none border py-2.5 pr-26 pl-4 text-sm placeholder-shown:caret-transparent focus-visible:ring-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
            inputClassName,
          )}
        />

        <div
          aria-hidden="true"
          className="text-text-second peer-focus:[&_.cursor]:animate-blink pointer-events-none absolute top-1/2 left-4 flex -translate-y-1/2 items-center text-sm uppercase opacity-0 transition-opacity peer-placeholder-shown:opacity-100"
        >
          &gt; search_database
          <span className="cursor">_</span>
        </div>
      </div>

      {variant === 'navigation' && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs">
          <span className="text-accent uppercase">[ ctrl k ]</span>
        </div>
      )}
    </div>
  )
}
