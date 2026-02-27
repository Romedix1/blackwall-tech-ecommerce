import { User2 } from 'lucide-react'
import Link from 'next/link'

export const NavbarUserProfile = () => {
  return (
    <Link
      href={'/login'}
      className="terminal-hover active:bg-primary-active relative flex cursor-pointer items-center gap-2 px-2 py-1.5"
    >
      <User2 />
      <span className="sr-only">sign in</span>
      <span aria-hidden="true">[ sign in ]</span>
    </Link>
  )
}
