'use client'

import { LogOutButton, NavLink } from '@/components/shared'
import { Separator } from '@/components/ui'
import { useSession } from 'next-auth/react'

const LINKS = [
  { text: 'My orders', href: '/dashboard/orders' },
  { text: 'Dashboard', href: '/dashboard' },
]

export const DesktopMenu = () => {
  const { data: session, status } = useSession()

  if (!session || !session.user) {
    return null
  }

  return (
    <div className="bg-surface top-18 right-20 hidden max-w-lg px-4.5 py-2 lg:fixed lg:block">
      <div className="flex w-full flex-col px-2 py-4">
        <div className="flex flex-col gap-2">
          <p className="uppercase">
            <span aria-hidden="true">{'//'} Active_session</span>
            <span className="sr-only">Active session</span>
          </p>

          <p className="text-text-second uppercase">
            <span aria-hidden="true">&gt;</span> Auth:{' '}
            <span className="truncate">{session.user.email}</span>
          </p>
          <p className="text-text-second uppercase">
            <span aria-hidden="true">&gt;</span> Clearance:{' '}
            <span className="sr-only">{session.user.role}</span>
            <span aria-hidden="true">[ {session.user.role} ]</span>
          </p>
        </div>

        <Separator className="my-4" />
        <ul className="flex flex-col gap-4">
          {LINKS.map((link, index) => {
            return (
              <li key={`desktop-link-${index}`}>
                <NavLink text={link.text} href={link.href} />
              </li>
            )
          })}
        </ul>
        <Separator className="my-4" />

        <LogOutButton />
      </div>
    </div>
  )
}
