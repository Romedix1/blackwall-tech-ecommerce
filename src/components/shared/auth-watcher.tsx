'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

export const AuthWatcher = () => {
  const { status } = useSession()

  const wasAuthenticated = useRef(false)

  useEffect(() => {
    if (status === 'authenticated') {
      wasAuthenticated.current = true
    }

    if (status === 'unauthenticated' && wasAuthenticated.current) {
      wasAuthenticated.current = false

      window.location.reload()
    }
  }, [status])

  return null
}
