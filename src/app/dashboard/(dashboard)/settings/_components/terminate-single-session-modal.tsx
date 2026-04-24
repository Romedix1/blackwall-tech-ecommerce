'use client'

import {
  InformationModal,
  StatusAlert,
  TerminalInput,
} from '@/components/shared'
import { Button } from '@/components/ui'
import { ResetPassword, TerminateSession } from '@/lib/actions/dashboard'
import { SessionType } from '@/types'
import { useSession } from 'next-auth/react'
import { useActionState, useEffect, useRef } from 'react'

type TerminateModalProps = {
  session: SessionType
  onClose: () => void
}

export const TerminateSingleSessionModal = ({
  session,
  onClose,
}: TerminateModalProps) => {
  const [state, formAction, isPending] = useActionState(TerminateSession, null)

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  return (
    <InformationModal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="border-error-text/20 border-b pb-2">
          <h2 className="text-error-text text-lg font-bold tracking-tighter break-all uppercase">
            <span aria-hidden="true">[ ! ] Uplink_termination_protocol</span>
            <span className="sr-only">Warning: Severing connection</span>
          </h2>
        </div>

        <div className="text-text-main flex flex-col gap-4 text-sm leading-relaxed tracking-tight uppercase">
          <p>
            <span className="text-error-text font-bold">Alert:</span> You are
            about to sever a remote access node. This action will immediately
            <span className="text-error-text">
              {' '}
              invalidate the session token{' '}
            </span>
            for the following uplink:
          </p>

          <div className="bg-error-text/5 border-error-text/20 flex flex-col gap-2 border p-3 text-xs">
            <p>NODE_IP: {session.ipAddress}</p>
            <p>
              Os: {session.os} {session.osVersion}
            </p>
            <p>
              Browser: {session.browser} {session.browserVersion}
            </p>
            <p>
              Location: {session.city}, {session.country}
            </p>
          </div>

          <p className="text-xs opacity-70">
            Proceeding will force the remote device to re-authenticate with
            master credentials.
          </p>
        </div>

        <form action={formAction}>
          <input
            type="hidden"
            name="connectionId"
            value={session.sessionToken || ''}
          />

          <div className="text-text-main flex flex-col gap-2">
            {state?.error && <StatusAlert text={state.error} variant="error" />}
            {state?.success && (
              <StatusAlert
                text="Uplink severed successfully. Connection terminated."
                variant="success"
              />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              disabled={isPending}
              onClick={onClose}
              variant="secondary"
              ref={cancelBtnRef}
            >
              <span aria-hidden="true">[ Abort ]</span>
              <span className="sr-only">Cancel procedure</span>
            </Button>

            <Button
              disabled={isPending || state?.success}
              type="submit"
              variant="delete"
              className="break-all"
            >
              <span aria-hidden="true">
                {isPending ? '[ Severing... ]' : '[ Sever_connection ]'}
              </span>
              <span className="sr-only">Confirm termination</span>
            </Button>
          </div>
        </form>
      </div>
    </InformationModal>
  )
}
