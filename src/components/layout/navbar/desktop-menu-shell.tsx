'use client'

import { DesktopMenu } from '@/components/layout/navbar/navbar-desktop-menu'
import { useDesktopMenu } from '@/hooks'

export const DesktopMenuShell = () => {
  const { isOpen } = useDesktopMenu()
  if (!isOpen) return null

  return <DesktopMenu />
}
