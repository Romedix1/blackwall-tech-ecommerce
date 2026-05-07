'use client'

import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type BuildLimitModalProps = {
  onClose: () => void
}

export const BuildLimitModal = ({ onClose }: BuildLimitModalProps) => {
  const MAX_LIMIT = 5

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleNavigation = () => {
    startTransition(() => {
      router.push('/dashboard/builds')
    })
  }

  return (
    <InformationModal
      onClose={onClose}
      aria-labelledby="limit-modal-title"
      aria-describedby="limit-modal-description"
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="border-error-text/20 flex flex-col gap-2 border-b pb-2">
          <h2
            id="limit-modal-title"
            className="text-error-text text-lg font-bold break-all lg:text-2xl"
          >
            <span aria-hidden="true">[ Uplink_capacity_exceeded ]</span>
            <span className="sr-only">Builds limit reached</span>
          </h2>
        </div>

        <div
          id="limit-modal-description"
          className="flex flex-col gap-4 text-sm leading-relaxed lg:text-base"
        >
          <p>
            <span className="text-error-text font-bold" aria-hidden="true">
              &gt; Protocol_error:
            </span>{' '}
            Maximum storage capacity reached
          </p>
          <p className="text-text-second">
            Your profile has hit the ceiling of{' '}
            <span className="text-accent font-bold">{MAX_LIMIT}</span> stored
            configurations. De-allocate existing memory slots to initiate a new
            assembly sequence.
          </p>
        </div>

        <div
          className="bg-background/40 border p-4 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-accent text-xs sm:text-sm">Storage Status</p>
          <p className="text-xl font-bold">
            {MAX_LIMIT} / {MAX_LIMIT}
            <span aria-hidden="true" className="text-text-second ml-2 text-xs">
              [ Full ]
            </span>
            <span className="sr-only">Full</span>
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-3 text-sm sm:flex-row-reverse sm:text-base">
          <Button
            disabled={isPending}
            onClick={handleNavigation}
            className="flex items-center justify-center"
          >
            <span aria-hidden="true">
              {isPending ? '[ Synchronizing... ]' : '[ Manage_Builds ]'}
            </span>
            <span className="sr-only">
              {isPending
                ? 'Loading dashboard'
                : 'Manage your builds in dashboard'}
            </span>
          </Button>

          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isPending}
            aria-label="Close limit notification"
          >
            <span aria-hidden="true">[ Back_to_Terminal ]</span>
            <span className="sr-only">Back to Terminal</span>
          </Button>
        </div>
      </div>
    </InformationModal>
  )
}
