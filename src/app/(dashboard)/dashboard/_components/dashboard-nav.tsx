import { auth } from '@/auth'
import { LogOutButton, NavigationLinks } from '@/components/shared'
import { cn } from '@/lib'

export const DashboardNav = async () => {
  const session = await auth()
  const userRole = session?.user.role

  const isAdmin = userRole === 'admin'
  const header = isAdmin
    ? 'root@system:~# OVERRIDE_CONTROLS'
    : '// TERMINAL_ACCESS'
  const headerSr = isAdmin ? 'Admin override controls' : 'Terminal access'

  const ADMIN_LINKS = [
    { href: '/dashboard', label: 'System_metrics', sr: 'System metrics' },
    {
      href: '/dashboard/inventory',
      label: '[ Inventory_db ]',
      sr: 'Database inventory',
    },
    {
      href: '/dashboard/queue',
      label: '[ Directive_queue ]',
      sr: 'Directive queue',
    },
    {
      href: '/dashboard/records',
      label: '[ Operative_records ]',
      sr: 'Operative records',
    },
  ]

  const USER_LINKS = [
    { href: '/dashboard', label: '[ Status_report ]', sr: 'Status report' },
    {
      href: '/dashboard/history',
      label: '[ Order_history ]',
      sr: 'Order history',
    },
    {
      href: '/dashboard/builds',
      label: '[ Saved_builds ]',
      sr: 'Saved builds',
    },
    { href: '/dashboard/settings', label: '[ Settings ]', sr: 'Settings' },
  ]

  const links = isAdmin ? ADMIN_LINKS : USER_LINKS

  return (
    <nav
      aria-label="Dashboard sidebar"
      className="mb-8 w-full max-w-full overflow-hidden"
    >
      <>
        <h2
          className={cn(
            'text-text-second mb-6 text-sm font-bold uppercase lg:text-base 2xl:text-xl',
          )}
        >
          <span aria-hidden="true">{header}</span>
          <span className="sr-only">{headerSr}</span>
        </h2>

        <div className="relative w-full min-w-0">
          <NavigationLinks links={links} />
        </div>

        <div className="mt-16 hidden lg:block">
          <LogOutButton
            isAdmin={isAdmin}
            className="px-0 text-sm 2xl:text-base"
          />
        </div>
      </>
    </nav>
  )
}
