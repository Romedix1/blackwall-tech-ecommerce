import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { InputHTMLAttributes, Ref } from 'react'

interface TerminalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  ariaLabel: string
  ref?: Ref<HTMLInputElement>
}

const TerminalInput = ({
  className,
  type,
  placeholder,
  ariaLabel,
  ref,
  ...props
}: TerminalInputProps) => {
  return (
    <div className={cn('relative')}>
      <Input
        {...props}
        ref={ref}
        type={type}
        placeholder=" "
        aria-label={ariaLabel}
        className={cn(
          'peer bg-background hover:border-primary-hover caret-accent h-12 w-full rounded-none border pr-26 pl-4 text-sm transition-colors duration-200 focus-visible:ring-0',
          className,
        )}
      />

      <div
        aria-hidden="true"
        className="text-text-second peer-focus:[&_.cursor]:animate-blink pointer-events-none absolute top-1/2 left-4 flex -translate-y-1/2 items-center text-sm uppercase opacity-0 transition-opacity peer-placeholder-shown:opacity-100 md:text-base"
      >
        &gt; {placeholder}
        <span className="cursor">_</span>
      </div>
    </div>
  )
}

export { TerminalInput }
