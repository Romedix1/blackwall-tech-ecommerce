'use client'

import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const AuthWatcher = () => {
  const { status } = useSession()

  const pathname = usePathname()
  const wasAuthenticated = useRef(false)

  useEffect(() => {
    if (status === 'authenticated') {
      wasAuthenticated.current = true
    }

    if (status === 'unauthenticated' && wasAuthenticated.current) {
      wasAuthenticated.current = false

      if (pathname !== '/login') {
        signOut({ callbackUrl: '/login?error=session-expired' })
      }
    }
  }, [pathname, status])

  return null
}
