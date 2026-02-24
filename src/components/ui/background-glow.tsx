import { cn } from '@/lib/utils'

type BackgroundGlowProps = {
  className?: string
}

export const BackgroundGlow = ({ className }: BackgroundGlowProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-accent/50 absolute top-1/2 left-1/2 z-10 h-52 w-52 -translate-x-1/2 -translate-y-3/4 rounded-full blur-[180px]',
        className,
      )}
    ></div>
  )
}
