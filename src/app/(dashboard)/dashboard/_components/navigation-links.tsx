'use client'

import { cn } from '@/lib'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavigationLinksProps = {
  isAdmin: boolean
}

export const NavigationLinks = ({ isAdmin }: NavigationLinksProps) => {
  const ADMIN_LINKS = [
    { href: '/dashboard', label: 'System_metrics', sr: 'System metrics' },
    {
      href: '/dashboard/inventory',
      label: 'Inventory_db',
      sr: 'Database inventory',
    },
    {
      href: '/dashboard/queue',
      label: 'Directive_queue',
      sr: 'Directive queue',
    },
    {
      href: '/dashboard/records',
      label: 'Operative_records',
      sr: 'Operative records',
    },
  ]

  const USER_LINKS = [
    { href: '/dashboard', label: 'Status_report', sr: 'Status report' },
    { href: '/dashboard/history', label: 'Order_history', sr: 'Order history' },
    { href: '/dashboard/builds', label: 'Saved_builds', sr: 'Saved builds' },
    { href: '/dashboard/settings', label: 'Settings', sr: 'Settings' },
  ]

  const links = isAdmin ? ADMIN_LINKS : USER_LINKS

  const pathname = usePathname()

  return (
    <ul className="flex gap-3 overflow-x-auto pb-4 lg:w-full lg:flex-col">
      {links.map((link) => {
        return (
          <li
            key={link.sr}
            className={cn(
              'text-xs font-bold uppercase lg:text-sm 2xl:text-base',
              pathname === link.href && 'text-accent',
            )}
          >
            <Link
              href={link.href}
              className="terminal-hover group overflow-hidden whitespace-nowrap"
            >
              <span aria-hidden="true">
                <span
                  className={cn(
                    'mr-2 hidden group-hover:inline-block group-focus:inline-block',
                    pathname === link.href && 'inline-block',
                  )}
                >
                  &gt;
                </span>
                [ {link.label} ]
              </span>
              <span className="sr-only">{link.sr}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
