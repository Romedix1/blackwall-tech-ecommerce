import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { InputHTMLAttributes, Ref } from 'react'

type BaseProps = InputHTMLAttributes<HTMLInputElement> & {
  ariaLabel: string
  ref?: Ref<HTMLInputElement>
}

type EditableInputProps = BaseProps & {
  readOnly?: false
  placeholder: string
}

type ReadOnlyInputProps = BaseProps & {
  readOnly: true
  placeholder?: string
}

type TerminalInputProps = EditableInputProps | ReadOnlyInputProps

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
          'peer bg-background hover:border-primary-hover caret-accent h-12 w-full rounded-none border pr-4 pl-4 text-sm transition-colors duration-200 focus-visible:ring-0 sm:pr-26',
          className,
        )}
      />

      <div
        aria-hidden="true"
        className="text-text-second peer-focus:[&_.cursor]:animate-blink pointer-events-none absolute top-1/2 right-4 left-4 inline-block -translate-y-1/2 items-center text-sm break-all uppercase opacity-0 transition-opacity peer-placeholder-shown:opacity-100 md:text-base"
      >
        &gt; {placeholder}
        <span className="cursor">_</span>
      </div>
    </div>
  )
}

export { TerminalInput }
