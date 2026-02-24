import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  className?: string
}

export const Eyebrow = ({ children, className }: EyebrowProps) => {
  return <p className={cn('text-accent uppercase', className)}>{children}</p>
}
