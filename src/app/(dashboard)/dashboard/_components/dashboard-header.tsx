import { ReactNode } from 'react'

type DashboardHeaderProps = {
  children: ReactNode
}

export const DashboardHeader = ({ children }: DashboardHeaderProps) => {
  return (
    <h1 className="text-text-second text-lg font-bold uppercase lg:text-xl 2xl:text-2xl">
      {children}
    </h1>
  )
}
