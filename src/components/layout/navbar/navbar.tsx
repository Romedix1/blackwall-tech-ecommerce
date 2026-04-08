import { DesktopMenuShell, NavbarSearch } from '@/components/layout/navbar'
import { NavbarLogo } from './navbar-logo'
import { NavbarActions } from '@/components/layout/navbar'
import { MobileSearchTrigger } from '@/components/layout/navbar'
import { MobileMenuShell } from '@/components/layout/navbar'
import { SessionProvider } from 'next-auth/react'

export const Navbar = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b p-3 lg:px-20 lg:py-2.5"
    >
      <div className="flex justify-start lg:flex-1">
        <NavbarLogo />
      </div>

      <div className="flex flex-1 justify-end lg:justify-center">
        <div className="flex w-full justify-end lg:justify-center">
          <NavbarSearch variant="navigation" />

          <MobileSearchTrigger />
        </div>
      </div>

      <div className="ml-3 flex justify-end lg:ml-0 lg:flex-1">
        <NavbarActions />
      </div>

      <MobileMenuShell />
      <SessionProvider>
        <DesktopMenuShell />
      </SessionProvider>
    </nav>
  )
}
