import { LogOutButton } from '@/app/components/log-out'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const MobileNavLinks = () => {
  const linkStyle =
    'terminal-hover w-full px-2 py-1.5 outline-none uppercase group active:bg-primary-active'

  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <Link href="/dashboard/orders" className={cn(linkStyle)}>
        <span className="sr-only">My orders</span>
        <span aria-hidden="true">
          <span className="hidden group-hover:inline-block group-focus:inline-block">
            &gt;
          </span>{' '}
          [ My orders ]
        </span>
      </Link>
      <Link href="/dashboard" className={cn(linkStyle)}>
        <span className="sr-only">Dashboard</span>
        <span aria-hidden="true">
          <span className="hidden group-hover:inline-block group-focus:inline-block">
            &gt;
          </span>{' '}
          [ Dashboard ]
        </span>
      </Link>

      <Separator className="mb-3" />

      <LogOutButton />
    </div>
  )
}
