'use client'

import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { useDesktopMenu } from '@/hooks'
import { LogoutAllSessions } from '@/lib/actions/dashboard'
import { useTransition } from 'react'

type TerminateModalProps = {
  onClose: () => void
}

export const TerminateSessionsModal = ({ onClose }: TerminateModalProps) => {
  const [isPending, startTransition] = useTransition()
  const { close } = useDesktopMenu()

  const handleLogout = () => {
    startTransition(async () => {
      const result = await LogoutAllSessions()
      if (result?.success) {
        close()
      }
    })
  }

  return (
    <InformationModal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="border-error-text/20 border-b pb-2">
          <h2 className="text-error-text text-lg font-bold tracking-tighter uppercase">
            <span aria-hidden="true">[ ! ] CRITICAL_SESSION_PURGE</span>
            <span className="sr-only">
              Warning: Critical session purge protocol
            </span>
          </h2>
        </div>

        <div className="text-text-main flex flex-col gap-4 text-sm leading-relaxed tracking-tight uppercase">
          <p>
            <span className="text-error-text font-bold">Warning:</span> You are
            initiating a forced disconnection procedure for all active remote
            sessions associated with this identity.
          </p>

          <div
            role="note"
            className="border-error-text bg-error-bg/20 border-l-2 p-3 italic"
          >
            All active access keys on other devices will be immediately
            invalidated. Connections with external nodes will be severed.
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button disabled={isPending} onClick={onClose} variant="secondary">
            <span aria-hidden="true">[ Abort ]</span>
            <span className="sr-only">
              Abort mission and return to settings
            </span>
          </Button>
          <Button disabled={isPending} onClick={handleLogout} variant="delete">
            <span aria-hidden="true">[ EXECUTE_PURGE ]</span>
            <span className="sr-only">
              Confirm and execute global session purge
            </span>
          </Button>
        </div>
      </div>
    </InformationModal>
  )
}
