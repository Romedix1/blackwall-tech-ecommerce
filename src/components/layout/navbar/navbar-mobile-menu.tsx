'use client'

import { MobileNavLinks } from '@/components/layout/navbar'
import { MobileSessionInfo } from '@/components/layout/navbar'
import { SearchInput } from '@/components/shared'
import { Separator } from '@/components/ui'
import { useMobileMenu } from '@/hooks/use-mobile-menu'
import { useEffect, useRef } from 'react'

export const MobileMenu = () => {
  const { shouldFocusSearch, focusTrigger } = useMobileMenu()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (shouldFocusSearch) {
      inputRef.current?.focus()
    }
  }, [shouldFocusSearch, focusTrigger])

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="mobile-menu"
      data-testid="mobile-menu"
      className="bg-background w fixed top-15 left-0 h-screen w-screen lg:hidden"
    >
      <div className="flex w-full flex-col px-2 py-4">
        <SearchInput
          ref={inputRef}
          ariaLabel="Search in database"
          containerClassName="w-full mb-2"
        />

        <MobileSessionInfo />

        <Separator className="mt-4" />

        <MobileNavLinks />
      </div>
    </div>
  )
}
