'use client'

import { cn } from '@/lib'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

type LogOutButtonProps = {
  className?: string
  isAdmin?: boolean
}

export const LogOutButton = ({
  className,
  isAdmin = false,
}: LogOutButtonProps) => {
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
      className={cn(
        'text-error-text focus:bg-error-bg hover:bg-error-bg group cursor-pointer p-1 outline-none',
        className,
      )}
      disabled={isLoading}
      onClick={handleLogout}
    >
      <div className="group-hover:animate-glitch group-focus:animate-glitch text-left uppercase outline-none disabled:cursor-wait disabled:opacity-50 motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none">
        {isAdmin ? (
          <>
            <span className="sr-only">[Log out (Terminate root session) ]</span>
            <span aria-hidden="true">[ Terminate_root_session ]</span>
          </>
        ) : (
          <>
            <span className="sr-only">Log out (Sever connection)</span>
            <span aria-hidden="true">[ Sever_connection ]</span>
          </>
        )}
      </div>
    </button>
  )
}
