'use client'

import { cn } from '@/lib'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type LinkType = {
  href: string
  label: string
  sr: string
}

type NavigationLinksProps = {
  links: LinkType[]
}

export const NavigationLinks = ({ links }: NavigationLinksProps) => {
  const pathname = usePathname()

  return (
    <ul className="flex gap-3 overflow-x-auto pb-4 lg:w-full lg:flex-col">
      {links.map((link) => {
        return (
          <li
            key={link.sr}
            className={cn(
              'text-xs font-bold uppercase lg:text-sm 2xl:text-base',
              pathname === `${link.href}` && 'text-accent',
            )}
          >
            <Link
              href={`${link.href}`}
              className="terminal-hover group overflow-hidden whitespace-nowrap"
            >
              <span aria-hidden="true">
                <span
                  className={cn(
                    'mr-2 hidden group-hover:inline-block group-focus:inline-block',
                    pathname === `${link.href}` && 'inline-block',
                  )}
                >
                  &gt;
                </span>
                {link.label}
              </span>
              <span className="sr-only">{link.sr}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
