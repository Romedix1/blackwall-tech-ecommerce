'use client'

import {
  InformationModal,
  StatusAlert,
  TerminalInput,
} from '@/components/shared'
import { Button } from '@/components/ui'
import { ResetPassword } from '@/lib/actions/dashboard'
import { useSession } from 'next-auth/react'
import { useActionState, useEffect, useRef } from 'react'

type TerminateModalProps = {
  onClose: () => void
}

export const ChangePasswordModal = ({ onClose }: TerminateModalProps) => {
  const [state, formAction, isPending] = useActionState(ResetPassword, null)
  const { update } = useSession()

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null)
  const hasUpdated = useRef(false)

  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (state?.success && !hasUpdated.current) {
      const now = new Date()

      update({ passwordChangedAt: now }).then(() => {
        hasUpdated.current = true
        setTimeout(onClose, 2000)
      })
    }
  }, [onClose, state?.success, update])

  return (
    <InformationModal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="border-error-text/20 border-b pb-2">
          <h2 className="text-error-text text-lg font-bold tracking-tighter break-all uppercase">
            <span aria-hidden="true">[ ! ] PASSWORD_OVERRIDE_PROTOCOL</span>
            <span className="sr-only">Warning: Password modification</span>
          </h2>
        </div>

        <div className="text-text-main flex flex-col gap-4 text-sm leading-relaxed tracking-tight uppercase">
          <p>
            <span className="text-error-text font-bold">Alert:</span> You are
            about to modify the master access credential for this identity. This
            action triggers an{' '}
            <span className="text-error-text">
              automatic security key rotation
            </span>
            . Secondary session tokens will be deprecated; current uplink
            remains established.
          </p>
        </div>

        <form action={formAction}>
          <div className="text-text-main flex flex-col gap-2">
            <TerminalInput
              type="password"
              name="currentPassword"
              aria-label="Current password"
              placeholder="Current password"
              defaultValue={state?.fields?.currentPassword || ''}
            />
            <TerminalInput
              type="password"
              name="newPassword"
              aria-label="New password"
              placeholder="New password"
              defaultValue={state?.fields?.newPassword || ''}
            />
            <TerminalInput
              type="password"
              name="confirmNewPassword"
              aria-label="Confirm new password"
              placeholder="Confirm password"
              defaultValue={state?.fields?.confirmNewPassword || ''}
            />

            {state?.error && <StatusAlert text={state.error} variant="error" />}
            {state?.success && (
              <StatusAlert text={state.message} variant="success" />
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
              <span className="sr-only">Cancel password change</span>
            </Button>
            <Button disabled={isPending} type="submit">
              <span aria-hidden="true">
                {isPending ? '[ PROCESSING... ]' : '[ UPDATE ]'}
              </span>
              <span className="sr-only">Confirm password change</span>
            </Button>
          </div>
        </form>
      </div>
    </InformationModal>
  )
}
