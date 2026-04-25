import { ReactNode, HTMLAttributes } from 'react'

interface OrderDetailsHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  level: 3 | 4
}
export const OrderDetailsHeader = ({
  children,
  level,
  ...props
}: OrderDetailsHeaderProps) => {
  if (level === 3) {
    return (
      <h3
        className="text-accent text-xs font-bold tracking-widest uppercase lg:text-sm"
        {...props}
      >
        {children}
      </h3>
    )
  } else if (level === 4) {
    return (
      <dt
        className="text-text-second mb-2 text-[11px] uppercase lg:text-[13px]"
        {...props}
      >
        {children}
      </dt>
    )
  }
}
