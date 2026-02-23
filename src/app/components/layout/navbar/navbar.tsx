import { NavbarSearch } from '@/app/components/layout/navbar/navbar-search'
import { NavbarLogo } from './navbar-logo'
import { NavbarActions } from '@/app/components/layout/navbar/navbar-actions'
import { Search } from 'lucide-react'

export const Navbar = () => {
  return (
    <nav className="bg-background sticky top-0 z-50 flex w-full items-center border-b p-3 lg:px-20 lg:py-2.5">
      <div className="flex justify-start lg:flex-1">
        <NavbarLogo />
      </div>

      <div className="flex flex-1 justify-end lg:justify-center">
        <div className="flex w-full justify-end lg:justify-center">
          <NavbarSearch variant="navigation" />

          <button className="terminal-hover lg:hidden">
            <Search
              aria-label="Open search"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </button>
        </div>
      </div>

      <div className="ml-3 flex justify-end lg:ml-0 lg:flex-1">
        <NavbarActions />
      </div>
    </nav>
  )
}
