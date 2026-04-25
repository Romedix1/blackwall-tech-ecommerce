import { cn } from '@/lib'

type StatusVariant = 'error' | 'success'

type StatusAlertProps = {
  text: string[] | string
  variant: StatusVariant
}

const CONFIG = {
  error: {
    container: 'bg-error-bg/40 text-error-text',
    title: 'Critical_error_detected',
    titleSr: 'Critical error',
    icon: '[!]',
  },
  success: {
    container: 'bg-accent/20 text-accent',
    title: 'System_recalibration_complete',
    titleSr: 'Username changed',
    icon: '[+]',
  },
}

export const StatusAlert = ({ text, variant }: StatusAlertProps) => {
  const { container, title, titleSr, icon } = CONFIG[variant]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'mt-4 w-full p-4',
        container,
        variant === 'error' && 'animate-shake',
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase md:text-base">
        <span aria-hidden="true">&gt;</span>
        <span aria-hidden="true">{title}</span>
        <span className="sr-only">{titleSr}</span>
      </div>
      <div className="text-xs uppercase md:text-sm">
        {Array.isArray(text) ? (
          text.map((error, index) => (
            <p key={`${error}-${index}`} className="my-1">
              <span aria-hidden="true">{icon} </span>
              {error}
            </p>
          ))
        ) : (
          <p className="my-1">
            <span aria-hidden="true">{icon} </span>

            {text}
          </p>
        )}
      </div>
    </div>
  )
}
