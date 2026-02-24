import { User2 } from 'lucide-react'

export const NavbarUserProfile = () => {
  return (
    <button className="terminal-hover active:bg-primary-active relative flex cursor-pointer items-center gap-2 px-2 py-1.5">
      <User2 />
      <span className="uppercase">[ sign in ]</span>
    </button>
  )
}
