import { Input } from '@/components/ui/input'

type SearchInputProps = {
  variant?: 'default' | 'navigation'
}

export default function SearchInput({ variant = 'default' }: SearchInputProps) {
  return (
    <div className="relative hidden w-100 lg:block">
      <div className="relative">
        <Input
          placeholder=" "
          aria-label="Search in database"
          className="peer bg-surface caret-accent h-10 rounded-none border py-2.5 pr-26 pl-4 text-sm placeholder-shown:caret-transparent focus-visible:ring-0"
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
