import { NavbarSearch } from '@/app/components/layout/navbar/navbar-search'
import { NavbarLogo } from './navbar-logo'

export const Navbar = () => {
  return (
    <nav className="bg-background flex w-full items-center justify-between border-b p-4 lg:px-20 lg:py-2.5">
      <NavbarLogo />

      <NavbarSearch />
    </nav>
  )
}
