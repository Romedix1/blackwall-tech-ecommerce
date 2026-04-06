import { NavigationLinks } from '@/app/(dashboard)/dashboard/_components'
import { auth } from '@/auth'
import { LogOutButton } from '@/components/shared'
import { cn } from '@/lib'

export const DashboardNav = async () => {
  const session = await auth()
  const userRole = session?.user.role

  const isAdmin = userRole === 'admin'
  const header = isAdmin
    ? 'root@system:~# OVERRIDE_CONTROLS'
    : '// TERMINAL_ACCESS'
  const headerSr = isAdmin ? 'Admin override controls' : 'Terminal access'

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
          <NavigationLinks isAdmin={isAdmin} />
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
