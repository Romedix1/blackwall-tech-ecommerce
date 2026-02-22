import Link from 'next/link'

export const NavbarLogo = () => {
  return (
    <Link href="/" className="lg:text-20 text-lg font-bold uppercase">
      Blackwall_<span className="text-accent">store</span>
    </Link>
  )
}
