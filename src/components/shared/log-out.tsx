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
      className="text-error-text focus:bg-error-bg hover:bg-error-bg group cursor-pointer p-1 outline-none"
      disabled={isLoading}
      onClick={handleLogout}
    >
      <div className="group-hover:animate-glitch group-focus:animate-glitch text-left uppercase outline-none disabled:cursor-wait disabled:opacity-50 motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none">
        <span className="sr-only">Log out (sever connection)</span>
        <span aria-hidden="true">[ sever_connection ]</span>
      </div>
    </button>
  )
}
