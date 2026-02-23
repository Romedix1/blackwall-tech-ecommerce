'use client'

import { MobileMenu } from '@/app/components/layout/navbar/navbar-mobile-menu'
import { useMobileMenu } from '@/hooks/use-mobile-menu'

export const MobileMenuShell = () => {
  const { isOpen } = useMobileMenu()
  if (!isOpen) return null

  return <MobileMenu />
}
