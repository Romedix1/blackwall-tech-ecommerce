import { ReactNode } from 'react'

type SettingsHeaderProps = {
  children: ReactNode
}

export const SettingsHeader = ({ children }: SettingsHeaderProps) => {
  return (
    <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase">
      {children}
    </h3>
  )
}
