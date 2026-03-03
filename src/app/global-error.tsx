'use client'

import { cn } from '@/lib/utils'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const LOG_CLASS = 'animate-in fade-in duration-[1ms] fill-mode-backwards'

  if (process.env.NODE_ENV === 'development') {
    console.error(' [ BLACKWALL_SYS ]:', error)
  }

  return (
    <html lang="en">
      <body className={cn(robotoMono.variable, 'antialiased')}>
        <main className="p-6 sm:w-112.5 lg:w-175 lg:p-24">
          <header className="text-error-text mb-4 text-base font-bold uppercase sm:text-2xl">
            <h1>
              <span aria-hidden="true">[ Critical_system_failure ]</span>
              <span className="sr-only">Critical system failure</span>
            </h1>
          </header>

          <div className="text-text-second flex flex-col gap-2 text-xs uppercase sm:text-sm">
            <p className={cn(LOG_CLASS)}>
              <span aria-hidden="true">&gt; </span>
              Fatal exception executing root layout
            </p>

            <p className={cn(LOG_CLASS, '[animation-delay:1s]')}>
              <span aria-hidden="true">&gt; </span>Memory dump initiated... 100%
            </p>

            <p className={cn(LOG_CLASS, '[animation-delay:2s]')}>
              <span aria-hidden="true">&gt; </span>Core dump saved to:
              /var/log/syslog
            </p>

            <p className={cn(LOG_CLASS, '[animation-delay:3s]')}>
              <span aria-hidden="true">&gt; </span>System halted. Manual reboot
              required
            </p>

            <p
              className={cn(LOG_CLASS, '[animation-delay:4s]')}
              aria-hidden="true"
            >
              &gt; <span className="animate-blink">_</span>
            </p>
          </div>

          <Button
            variant={'primary'}
            className={cn(
              'bg-error-text hover:bg-error-text/70 active:bg-error-text/80 focus:bg-error-text/70 mt-12 font-black text-black hover:text-black focus:text-black lg:w-7/12',
            )}
            onClick={() => reset()}
          >
            <span aria-hidden="true" className="uppercase">
              [ Initiate_hard_reboot ]
            </span>
            <span className="sr-only">Initiate hard reboot</span>
          </Button>
        </main>
      </body>
    </html>
  )
}
