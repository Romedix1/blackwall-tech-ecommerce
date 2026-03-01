'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export const LogOutButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      })
    } catch (error) {
      console.error('[CRITICAL_ERROR]: Failed to sever connection', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      disabled={isLoading}
      onClick={handleLogout}
      className="text-error-text focus:border-error-text hover:border-error-text hover:animate-glitch focus:animate-glitch w-fit cursor-pointer border border-transparent px-2 text-left uppercase outline-none disabled:cursor-wait disabled:opacity-50 motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none"
    >
      <span className="sr-only">Log out (sever connection)</span>
      <span aria-hidden="true">[ sever_connection ]</span>
    </button>
  )
}
