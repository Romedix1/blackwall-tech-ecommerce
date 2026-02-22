import { NavbarLogo } from './navbar-logo'

export const Navbar = () => {
  return (
    <nav className="bg-background flex w-full justify-between border-b p-4 lg:px-20 lg:py-2.5">
      <NavbarLogo />
    </nav>
  )
}
