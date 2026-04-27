'use client'

import { cn } from '@/lib'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

type LinkType = {
  href: string
  label: string
  sr: string
}

type NavigationLinksProps = {
  links: LinkType[]
  isPcBuilderLink?: boolean
}

export const NavigationLinks = ({
  links,
  isPcBuilderLink = false,
}: NavigationLinksProps) => {
  const pathname = usePathname()

  const params = useParams()
  const id = params?.id as string

  return (
    <ul className="flex gap-3 overflow-x-auto pb-4 lg:w-full lg:flex-col">
      {links.map((link) => {
        const fullHref = isPcBuilderLink ? `${link.href}/${id}` : link.href
        const isActive = pathname === fullHref

        return (
          <li
            key={link.sr}
            className={cn(
              'text-xs font-bold uppercase lg:text-sm 2xl:text-base',
              isActive && 'text-accent',
            )}
          >
            <Link
              href={fullHref}
              className="terminal-hover group overflow-hidden whitespace-nowrap"
            >
              <span aria-hidden="true">
                <span
                  className={cn(
                    'mr-2 hidden group-hover:inline-block group-focus:inline-block',
                    isActive && 'inline-block',
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
