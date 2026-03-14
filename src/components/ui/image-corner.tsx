import { cn } from '@/lib/utils'

type ImageCornerProps = {
  className?: string
}

export const ImageCorner = ({ className }: ImageCornerProps) => {
  return (
    <div className={cn('absolute', className)}>
      <div className="bg-accent h-6 w-0.5"></div>
      <div className="bg-accent h-0.5 w-7"></div>
    </div>
  )
}
