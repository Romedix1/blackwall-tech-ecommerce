import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
  'w-full h-14 uppercase transition-none outline-none font-bold cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-background active:bg-primary-active/60 hover:bg-primary-hover/70 hover:text-text-main focus:bg-primary-hover/70 focus:text-text-main ',
        secondary:
          'border border-accent bg-transparent text-accent active:bg-primary-active hover:bg-accent hover:text-background focus:bg-accent focus:text-background ',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button }
