'use client'

import { MobileMenu } from '@/components/layout/navbar'
import { useMobileMenu } from '@/hooks'

export const MobileMenuShell = () => {
  const { isOpen } = useMobileMenu()
  if (!isOpen) return null

  return <MobileMenu />
}
