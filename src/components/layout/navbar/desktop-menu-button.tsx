'use client'

import { useDesktopMenu } from '@/hooks/use-desktop-menu'

type OpenDesktopMenuProps = {
  user: string
}

export const DesktopMenuButton = ({ user }: OpenDesktopMenuProps) => {
  const { toggle } = useDesktopMenu()

  return (
    <button
      className="terminal-hover max-w-36 cursor-pointer truncate uppercase"
      onClick={toggle}
    >
      [ {user} ]
    </button>
  )
}
