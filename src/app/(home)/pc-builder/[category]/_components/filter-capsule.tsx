'use client'

import { cn } from '@/lib'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type FilterCapsuleProps = {
  categoryKey: string
  option: string | number
}

export const FilterCapsule = ({ categoryKey, option }: FilterCapsuleProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = String(option)
  const isActive = searchParams.get(categoryKey) === value

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete(categoryKey)
    } else {
      params.set(categoryKey, value)
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'terminal-hover cursor-pointer border px-3 py-2 text-sm whitespace-nowrap uppercase transition-colors outline-none',
        isActive && 'bg-accent text-surface',
      )}
    >
      <span className="font-bold">{categoryKey}:</span> <span>{option}</span>
    </button>
  )
}
