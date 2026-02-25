import Link from 'next/link'

export const NavbarLogo = () => {
  return (
    <Link
      aria-label="Blackwall Store"
      href="/"
      className="hover:animate-logo focus:animate-logo hover:text-error-text focus:text-error-text focus-visible:ring-accent focus-visible:ring-offset-background group text-sm font-bold uppercase outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:animate-none motion-reduce:hover:animate-none motion-reduce:focus:animate-none sm:text-lg lg:text-xl"
    >
      <span aria-hidden="true">
        Blackwall_
        <span className="text-accent group-hover:text-error-text group-focus:text-error-text">
          tech
        </span>
      </span>
    </Link>
  )
}
